import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';

async function generateTestCard() {
    const width = 1024;
    const height = 409;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 1. Draw Background
    const bg = await loadImage('src/assets/welcome_bg.png');
    ctx.drawImage(bg, 0, 0, width, height);

    // 2. Draw Avatar (Simulated)
    // The circle in the template is located at center: X=512
    // Let's test Y position. Let's try Y=186 (center of the glowing ring)
    const avatarX = 512;
    const avatarY = 190;
    const avatarRadius = 95;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    // Draw a placeholder colorful avatar
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
    ctx.fillStyle = '#0055ff';
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, 50, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();

    // 3. Draw Text
    // Let's write the user name below the avatar
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    
    // Welcome text
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('WELCOME', 512, 320);

    // Username & Member count
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText('trobax_ | MEMBER #729', 512, 355);

    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('src/assets/test_card.png', buffer);
    console.log('Test card saved to src/assets/test_card.png');
}

generateTestCard().catch(console.error);
