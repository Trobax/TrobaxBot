import { logger } from './logger.js';

const DEFAULT_TEMPLATES = {
    welcome: `<a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744>
               <a:giveawayfeast:784039602788761620><a:giveawayfeast:784039602788761620>    Welcome to [server]   <a:giveawayfeast:784039602788761620><a:giveawayfeast:784039602788761620> 

<a:loading_discord:1516466722499199177> - USER : 『  [user] 』. <a:loading_discord:1516466722499199177>
   <a:pin:1516467379272552660> - USERNUMBER :   [memberCount]  <a:pin:1516467379272552660>
     <a:arrow:1516467831510667506>  - [user] read :scroll:↣｜[rules]
<a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744><a:seperators:784039573780168744>`,
    goodbye: '{user.tag} has left the server.'
};

function replaceAll(message, token, value) {
    if (value === undefined || value === null) {
        return message;
    }
    return message.split(token).join(String(value));
}






export function formatWelcomeMessage(message, data) {
    
    if (typeof message !== 'string') return '';
    if (!message) return '';
    if (!data || typeof data !== 'object') return message;

    const user = data?.user;
    const guild = data?.guild;

    
    if (!user || typeof user !== 'object') {
        logger.warn('Invalid user object passed to formatWelcomeMessage');
    }
    if (!guild || typeof guild !== 'object') {
        logger.warn('Invalid guild object passed to formatWelcomeMessage');
    }

    const tokens = {
        '{user}': user?.toString?.() || 'User',
        '[user]': user?.toString?.() || 'User',
        '{user.mention}': user?.toString?.() || 'User',
        '{user.tag}': user?.tag || 'Unknown#0000',
        '{user.username}': user?.username || 'Unknown',
        '{username}': user?.username || 'Unknown',
        '[username]': user?.username || 'Unknown',
        '{user.discriminator}': user?.discriminator || '0000',
        '{user.id}': user?.id || 'unknown',
        '{server}': guild?.name || 'Server',
        '[server]': guild?.name || 'Server',
        '{server.name}': guild?.name || 'Server',
        '{guild.name}': guild?.name || 'Server',
        '{guild.id}': guild?.id || 'unknown',
        '{guild.memberCount}': guild?.memberCount?.toString?.() || '0',
        '{memberCount}': guild?.memberCount?.toString?.() || '0',
        '[memberCount]': guild?.memberCount?.toString?.() || '0',
        '{membercount}': guild?.memberCount?.toString?.() || '0',
        '[rules]': guild?.rulesChannel?.toString?.() || guild?.channels?.cache?.find?.(c => c.name.toLowerCase().includes('rule'))?.toString?.() || 'rules',
        '{rules}': guild?.rulesChannel?.toString?.() || guild?.channels?.cache?.find?.(c => c.name.toLowerCase().includes('rule'))?.toString?.() || 'rules'
    };

    let result = message;
    for (const [token, value] of Object.entries(tokens)) {
        if (value === undefined || value === null) continue;
        result = replaceAll(result, token, String(value));
    }

    return result;
}

export function getDefaultWelcomeMessage() {
    return DEFAULT_TEMPLATES.welcome;
}

export function getDefaultGoodbyeMessage() {
    return DEFAULT_TEMPLATES.goodbye;
}


