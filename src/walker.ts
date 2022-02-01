import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import EventEmitter from 'events';

export declare interface Walker {
    on(event: 'start', listener: () => void): this;
    on(event: 'data', listener: (data: { path: string; isFile: () => boolean; isDirectory: () => boolean; }) => void): this;
    on(event: 'done', listener: () => void): this;
}

export class Walker extends EventEmitter {
    private paused: boolean;

    constructor(private directory: string) {
        super();
    }

    async walk() {
        this.emit('start', this.directory);

        const directories = [this.directory];
    
        for await (const directory of directories) {
            // If we're paused then bail
            if (this.paused) break;

            // Get an array of files and directories in this directory
            const result = await readdir(directory);
            await Promise.all(result.map(async file => {
                const filePath = join(directory, file);
    
                // Get info about the result
                const stats = await stat(filePath);

                this.emit('data', {
                    path: filePath,
                    isFile: () => stats.isFile(),
                    isDirectory: () => stats.isDirectory(),
                });
    
                // If this is a directory save it for the next pass
                if (stats.isDirectory()) {
                    directories.push(filePath);
                }
            }));
        }

        this.emit('done');
    }

    pause() {
        this.paused = true;
    }
}