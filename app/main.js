"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function parseRppFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs_1.promises.readFile(filePath, 'utf-8');
        const lines = data.split('\n');
        const clips = [];
        let itemBlock = false;
        let clip = {};
        for (const line of lines) {
            if (line.trim() === "<ITEM") {
                itemBlock = true;
                clip = {};
            }
            else if (line.trim() === ">") {
                if (itemBlock && clip.POSITION !== undefined && clip.LENGTH !== undefined && clip.NAME && clip.IGUID) {
                    clips.push(clip);
                }
                itemBlock = false;
            }
            else if (itemBlock) {
                if (line.includes("POSITION")) {
                    clip.POSITION = parseFloat(line.split(" ")[1]);
                }
                else if (line.includes("LENGTH")) {
                    clip.LENGTH = parseFloat(line.split(" ")[1]);
                }
                else if (line.includes("SOFFS")) {
                    clip.OFFSET = parseFloat(line.split(" ")[1]);
                }
                else if (line.includes("NAME")) {
                    clip.NAME = line.split(" ", 2)[1].trim();
                }
                else if (line.includes("IGUID")) {
                    clip.IGUID = line.split(" ", 2)[1].trim();
                }
            }
        }
        return clips;
    });
}
function detectChanges(controlFilePath, revisedFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const controlClips = yield parseRppFile(controlFilePath);
        const revisedClips = yield parseRppFile(revisedFilePath);
        const changedTimecodes = [];
        let cumulativeShift = 0;
        for (let i = 0; i < controlClips.length; i++) {
            const controlClip = controlClips[i];
            const revisedClip = revisedClips[i];
            if (revisedClip) {
                const positionDiff = Math.abs(controlClip.POSITION + cumulativeShift - revisedClip.POSITION);
                const lengthDiff = controlClip.LENGTH !== revisedClip.LENGTH;
                const offsetDiff = controlClip.OFFSET !== revisedClip.OFFSET;
                const contentDiff = controlClip.NAME !== revisedClip.NAME;
                if (positionDiff > 0.01 || lengthDiff || offsetDiff || contentDiff) {
                    changedTimecodes.push(revisedClip.POSITION);
                }
                if (lengthDiff) {
                    cumulativeShift += revisedClip.LENGTH - controlClip.LENGTH;
                }
            }
        }
        return changedTimecodes;
    });
}
// Example usage
const controlPath = 'path/to/Chapter 18.rpp';
const revisedPath = 'path/to/Chapter 18-b.rpp';
detectChanges(controlPath, revisedPath).then(changedTimecodes => {
    console.log("Changed timecodes:", changedTimecodes);
}).catch(error => {
    console.error("Error detecting changes:", error);
});
