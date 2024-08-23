function findMax(array: number[]): number {
    if (array.length === 0) {
        return NaN;
    }
    let result = array[0];
    for (let i = 1; i < array.length; ++i) {
        const entry = array[i];
        if (entry > result) {
            result = entry;
        }
    }
    return result;
};
function findMin(array: number[]): number {
    if (array.length === 0) {
        return NaN;
    }
    let result2 = array[0];
    for (let j = 1; j < array.length; ++j) {
        const entry2 = array[j];
        if (entry2 < result2) {
            result2 = entry2;
        }
    }
    return result2;
};
enum SCALE {
    //% block="Major"
    major,
    //% block="Minor"
    minor
}
enum INPUTSENSOR {
    //% block="light level"
    LIGHT,
    //% block="sound level"
    SOUND,
    //% block="acceleration (x)"
    ACCELERATIONX,
    //% block="acceleration (y)"
    ACCELERATIONY,
    //% block="acceleration (z)"
    ACCELERATIONZ,
    //% block="acceleration strength"
    ACCELERATIONSTRENGTH,
    //% block="compass heading"
    COMPASS
}
//% color="#e79724" icon="\uf001"
namespace sonification {
    /**
     * Re-maps all numbers in the array to a music scale on a number of octaves.
     * That is, the smallest number in the array would get mapped to the lowest tone on the music
     * scale specified, the largest number in the array would get mapped to the highest tone
     * on the same scale and values in-between to tones in-between.
    */
    //% blockId=maparray
    //% block="map array $list to $key $rule on $octaves octaves"
    //% inlineInputMode=inline
    //% key.shadow="device_note"
    //% key.defl=Note.C
    //% rule.shadow="chooseScale"
    //% rule.defl=Scale.major
    //% octaves.defl="1"
    //% group="Map"
    //% help=github:davidnsousa/docs/mapArray
    export function mapArray(list: number[], key: number, rule: number[], octaves: number): number[] {
        let notes: any[] = [key];
        for (let o = 1; o <= octaves; o++) {
            for (let r = 0; r < rule.length; r++) {
                notes.push(Math.round(o * key * rule[r]));
            }
        }
        let mappednotes: any[] = [];
        let low = findMin(list);
        let high = findMax(list);
        for (let k = 0; k < list.length; k++) {
            let mappedindex = Math.round(((list[k] - low) / (high - low)) * (notes.length - 1))
            mappednotes.push(notes[mappedindex]);
        }
        return mappednotes;
    }
    /**
     * Re-maps a number from a range to a music scale on a number of octaves.
     * That is, a value ``from low`` would get mapped to the lowest tone on the music
     * scale specified, a value ``high`` would get mapped to the highest tone
     * on the same scale and values in-between to tones in-between. 
    */
    //% blockId=mappedvalue
    //% block="map $value from low $low high $high to $key $rule on $octaves octaves"
    //% inlineInputMode=inline
    //% key.shadow="device_note"
    //% key.defl=Note.C
    //% rule.shadow="chooseScale"
    //% rule.defl=Scale.major
    //% octaves.defl="1"
    //% group="Map"
    //% help=github:davidnsousa/docs/map
    export function map(value: number, low: number, high: number, key: number, rule: number[], octaves: number): number {
        let notes2: any[] = [key];
        for (let p = 1; p <= octaves; p++) {
            for (let s = 0; s < rule.length; s++) {
                notes2.push(Math.round(p * key * rule[s]));
            }
        }
        let mappedindex2 = Math.round(((value - low) / (high - low)) * (notes2.length - 1))
        return notes2[mappedindex2];
    }
    /**
     * Re-maps a value measured from the chosen micro:bit sensor to a music scale on a number of octaves.
     * That is, the lowest measurable value would get mapped to the lowest tone on the music
     * scale specified, the highest measurable value would get mapped to the highest tone
     * on the same scale and values in-between to tones in-between.
    */
    //% blockId=PlaySensor
    //% block="play sensor $sensor mapped to $key $rule on $octaves octaves for $duration ms"
    //% inlineInputMode=inline
    //% key.shadow="device_note"
    //% key.defl=Note.C
    //% rule.shadow="chooseScale"
    //% rule.defl=Scale.major
    //% duration.defl=500
    //% octaves.defl="1"
    //% group="Play"
    //% help=github:davidnsousa/docs/playSensor
    export function playSensor(sensor: INPUTSENSOR, key: number, rule: number[], octaves: number, duration: number) {
        let value;
        let low2;
        let high2;
        switch (sensor) {
            case INPUTSENSOR.LIGHT:
                // Logic for light sensor
                value = input.lightLevel();
                low2 = 0;
                high2 = 255;
                break;
            case INPUTSENSOR.SOUND:
                // Logic for light sensor
                value = input.soundLevel();
                low2 = 0;
                high2 = 255;
                break;
            case INPUTSENSOR.ACCELERATIONX:
                // Logic for acceleration in the X direction
                value = input.acceleration(Dimension.X);
                low2 = 0;
                high2 = 1023;
                break;
            case INPUTSENSOR.ACCELERATIONY:
                // Logic for acceleration in the Y direction
                value = input.acceleration(Dimension.Y);
                low2 = 0;
                high2 = 1023;
                break;
            case INPUTSENSOR.ACCELERATIONZ:
                // Logic for acceleration in the Z direction
                value = input.acceleration(Dimension.Z);
                low2 = 0;
                high2 = 1023;
                break;
            case INPUTSENSOR.ACCELERATIONSTRENGTH:
                // Logic for acceleration strength
                value = input.acceleration(Dimension.Strength);
                low2 = 0;
                high2 = 1771;
                break;
            case INPUTSENSOR.COMPASS:
                // Logic for compass sensor
                value = input.compassHeading();
                low2 = 0;
                high2 = 359;
                break;
        }
        let notes3: any[] = [key];
        for (let q = 1; q <= octaves; q++) {
            for (let t = 0; t < rule.length; t++) {
                notes3.push(Math.round(q * key * rule[t]));
            }
        }
        let mappedindex3 = Math.round(((value - low2) / (high2 - low2)) * (notes3.length - 1))
        music.playTone(notes3[mappedindex3], duration);
    }
    /**
     * Play all tone frequencies from the input array sequentially, each with the specified duration.
    */
    //% blockId=music_play_array
    //% block="play tones from $array for $duration ms each tone"
    //% tone.shadow="device_note"
    //% duration.defl=500
    //% group="Play"
    //% help=github:davidnsousa/docs/playArray
    export function playArray(array: number[], duration: number) {
        for (let note of array) {
            music.playTone(note, duration);
        }
    }
    /**
     * Play the specified tone frequency with a certain duration.
    */
    //% blockId=music_play_note
    //% block="play tone $tone for $duration ms"
    //% tone.shadow="device_note"
    //% tone.defl=Note.C
    //% duration.defl=500
    //% group="Play"
    //% help=github:davidnsousa/docs/playNote
    export function playNote(tone: number, duration: number) {
        music.playTone(tone, duration);
    }
    /**
     * Stop all sounds for the specified duration.
    */
    //% blockId=rest
    //% block="rest for $duration ms"
    //% duration.defl=1000
    //% group="Play"
    //% help=github:davidnsousa/docs/rest
    export function rest(duration: number) {
        music.stopAllSounds();
        basic.pause(duration);
    }
    /**
     * Choose the input scale rule
     *  (an array containing the frequency ratios relative to the root frequency).
    */
    //% blockId=chooseScale
    //% block="$scale"
    //% group="Auxiliary"
    export function chooseScale(scale: SCALE): number[] {
        let rule: any[] = [];
        switch (scale) {
            case SCALE.major: rule = [9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2];
                break;
            case SCALE.minor: rule = [9 / 8, 6 / 5, 4 / 3, 3 / 2, 8 / 5, 9 / 5, 2];
                break;
        }
        return rule;
    }
}
