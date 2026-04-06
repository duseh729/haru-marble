import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');

// 간단한 .env 파싱 로직
let ngrokDomain = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/^NGROK_DOMAIN\s*=\s*(.*)$/m);
    if (match && match[1]) {
        ngrokDomain = match[1].trim();
    }
}

if (!ngrokDomain) {
    console.warn('⚠️  .env 파일에서 NGROK_DOMAIN을 찾을 수 없습니다. 기본 무작위 도메인을 사용합니다.');
}

const args = ['http'];
if (ngrokDomain) {
    args.push('--domain', ngrokDomain);
}
args.push('5173');

console.log(`🚀 터널을 엽니다: ngrok ${args.join(' ')}`);

const ngrok = spawn('ngrok', args, {
    shell: true,
    stdio: 'inherit'
});

ngrok.on('error', (err) => {
    console.error('❌ ngrok 실행 실패:', err);
    console.error('해결 방법: ngrok이 설치되어 있는지, 그리고 .env 설정이 맞는지 확인해 보세요.');
});
