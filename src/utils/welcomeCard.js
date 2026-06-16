import { createCanvas, loadImage } from '@napi-rs/canvas';
import { AttachmentBuilder } from 'discord.js';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BG_PATH = path.join(__dirname, '../assets/welcome_bg.png');

export async function createWelcomeCard(user, guild) {
    const width = 1024;
    const height = 409;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    try {
        // 1. Draw Background
        const bg = await loadImage(BG_PATH);
        ctx.drawImage(bg, 0, 0, width, height);

        // 2. Draw Avatar
        const avatarUrl = user.displayAvatarURL({ extension: 'png', forceStatic: true, size: 256 });
        console.log(`[WelcomeCard] User: ${user.tag}, avatarUrl: ${avatarUrl}`);
        
        let avatarImg;
        try {
            const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
            const avatarBuffer = Buffer.from(response.data);
            avatarImg = await loadImage(avatarBuffer);
            console.log(`[WelcomeCard] Avatar image loaded successfully? ${!!avatarImg}`);
        } catch (avatarError) {
            console.error(`[WelcomeCard] Failed to load avatar from ${avatarUrl} via axios:`, avatarError.message);
        }

        const avatarX = parseInt(process.env.WELCOME_CARD_AVATAR_X || '512', 10);
        const avatarY = parseInt(process.env.WELCOME_CARD_AVATAR_Y || '175', 10);
        const avatarRadius = parseInt(process.env.WELCOME_CARD_AVATAR_RADIUS || '90', 10);
        console.log(`[WelcomeCard] Drawing avatar at X: ${avatarX}, Y: ${avatarY}, Radius: ${avatarRadius}`);

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        if (avatarImg) {
            ctx.drawImage(
                avatarImg, 
                avatarX - avatarRadius, 
                avatarY - avatarRadius, 
                avatarRadius * 2, 
                avatarRadius * 2
            );
        } else {
            // Draw a futuristic placeholder shape if avatar fails to load
            ctx.fillStyle = '#00ffcc';
            ctx.fillRect(avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
            ctx.fillStyle = '#0055ff';
            ctx.beginPath();
            ctx.arc(avatarX, avatarY, 60, 0, Math.PI * 2, true);
            ctx.fill();
        }
        ctx.restore();

        // 3. Draw Welcome Text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        
        // Main welcome heading
        ctx.font = 'bold 36px sans-serif';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 8;
        const welcomeY = parseInt(process.env.WELCOME_CARD_TEXT_WELCOME_Y || '315', 10);
        ctx.fillText('WELCOME', 512, welcomeY);

        // Subtext with username and member count
        ctx.font = 'bold 26px sans-serif';
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12;
        
        const username = user.username.toUpperCase();
        const memberCount = guild.memberCount.toString();
        const subY = parseInt(process.env.WELCOME_CARD_TEXT_SUB_Y || '350', 10);
        ctx.fillText(`${username} | MEMBER #${memberCount}`, 512, subY);
        
        // Reset shadow
        ctx.shadowBlur = 0;

        // 4. Return as Discord Attachment
        const buffer = canvas.toBuffer('image/png');
        return new AttachmentBuilder(buffer, { name: 'welcome-card.png' });

    } catch (error) {
        logger.error('[WelcomeCard] Failed to generate welcome card:', error);
        return null;
    }
}
