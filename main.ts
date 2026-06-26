#!/usr/bin/env node

import {createRequire} from 'module';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline/promises';
import ffmpeg from 'ffmpeg-static';
import ora from 'ora';

// Создаем классический require внутри ESM модуля
const require = createRequire(import.meta.url);
const youtubedl = require('youtube-dl-exec');

async function downloadMedia(url: string, onlyAudio: boolean = false): Promise<void> {
    const outputFolder = 'Downloads';

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, {recursive: true});
    }

    if (!ffmpeg) {
        throw new Error('Не удалось загрузить FFmpeg.');
    }

    // Объект с опциями для youtube-dl-exec
    const options: any = {
        ffmpegLocation: ffmpeg,
        output: path.join(outputFolder, '%(title)s.%(ext)s'),
    };
    let spinner: any;

    if (onlyAudio) {
        spinner = ora('Извлекаю аудиодорожку в MP3...').start();
        // console.log('🎵 Извлекаю аудиодорожку в MP3...');
        options.extractAudio = true;
        options.audioFormat = 'mp3';
        options.format = 'bestaudio/best';
    } else {
        // console.log('🎬 Скачиваю видео в MP4 (максимальное качество)...');
        spinner = ora('Скачиваю видео в MP4 (максимальное качество)...').start();

        options.format = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
        options.mergeOutputFormat = 'mp4';
    }

    try {
        // Вызываем функцию из пакета youtube-dl-exec
        await youtubedl(url, options);
        spinner.stop();
        console.log(`🎉 Успешно сохранено в папку: ${outputFolder}`);
    } catch (error) {
        console.error('❌ Ошибка во время обработки:', error);
    }
}

// Консольное меню
const rl = readline.createInterface({input: process.stdin, output: process.stdout});

async function startApp() {

    let inputCommand: string = '';
    while (inputCommand !== 'quit') {

        inputCommand = await rl.question('\nВставь ссылку на видео (или "q" для выхода):');
        const trimmedCommand = inputCommand.trim();

        if (!trimmedCommand) {
            console.log('❌ Ссылка не может быть пустой!');
            continue;
        }

        switch (trimmedCommand) {
            case 'q':
            case 'quit':
                inputCommand = 'quit';
                rl.close();
                break;
            default:
                const clarifyCommand = await rl.question('Скачать как видео (1) или только звук как mp3 (2)?');
                const isAudio = clarifyCommand.trim() === '2';
                await downloadMedia(trimmedCommand.trim(), isAudio);
                break;
        }
    }
}

startApp();
