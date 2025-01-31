/**
 * Real-time and a posteriori data sonification blocks
 */
//% color="#e79724" icon="\uf001"
namespace sonification {
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
    export enum Scale {
        //% block="major"
        Major,
        //% block="minor"
        Minor
    }
    export enum InputSensor {
        //% block="light level"
        Light,
        //% block="acceleration (x)"
        AccelerationX,
        //% block="acceleration (y)"
        AccelerationY,
        //% block="acceleration (z)"
        AccelerationZ,
        //% block="acceleration strength"
        AccelerationStrength,
        //% block="compass heading"
        Compass
    }
    /**
     * Stop all sounds for the specified duration
     * @param duration a number specifying the amount of time during which all sounds stop,  eg: 1000
    */
    //% blockId=sonification-rest
    //% block="rest for $duration ms"
    //% duration.defl=1000
    //% group="Play"
    //% help=github:sonification/docs/rest
    export function rest(duration: number) {
        music.stopAllSounds();
        basic.pause(duration);
    }
    /**
     * Play all tone frequencies from the input array sequentially, each with the specified duration
     * @param array an array containing the tones, eg: []
     * @param duration a number specifying the amount of time during which each tone will play, eg: 200
     */
    //% blockId=sonification-playArray
    //% block="play $array for $duration ms each tone"
    //% duration.defl=500
    //% group="Play"
    //% help=github:sonification/docs/playArray
    export function playArray(array: number[], duration: number) {
        for (let note of array) {
            music.playTone(note, duration);
        }
    }
    /**
     * Play the specified tone frequency with a certain duration
     * @param tone a number specifying the frequency of the tone, eg: 262
     * @param duration a number specifying the amount of time during which each tone will play, eg: 500
    */
    //% blockId=sonification-playNote
    //% block="play $tone for $duration ms"
    //% tone.shadow="device_note"
    //% tone.defl=Note.C
    //% duration.defl=500
    //% group="Play"
    //% help=github:sonification/docs/playNote
    export function playNote(tone: number, duration: number) {
        music.playTone(tone, duration);
    }
    /**
     * Re-maps a value measured from the chosen micro:bit sensor to a music scale on a number of octaves. 
     * That is, the lowest measurable value would get mapped to the lowest tone on the music scale specified, the highest 
     * measurable value would get mapped to the highest tone on the same scale and values in-between to tones in-between.
     * @param sensor the micro:bit sensor, eg: sonification.InputSensor.Light
     * @param key a number specifying the root frequency of the target scale, eg: 262
     * @param rule an array containing the frequency ratios, eg: sonification.chooseScale(sonification.Scale.Major)
     * @param octaves a number specifying the number of octaves, eg: 1
     * @param duration a number specifying the amount of time during which each tone will play, eg: 500
     */
    //% blockId=sonification-playSensor
    //% block="play $sensor on $key $rule || on $octaves octaves for $duration ms"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode=inline
    //% key.shadow="device_note"
    //% key.defl=Note.C
    //% rule.shadow="sonification-chooseScale"
    //% duration.defl=500
    //% octaves.defl="1"
    //% group="Play"
    //% help=github:sonification/docs/playSensor
    export function playSensor(sensor: InputSensor, key: number, rule: number[], octaves?: number, duration?: number) {
        let value;
        let low2;
        let high2;
        switch (sensor) {
            case InputSensor.Light:
                // Logic for light sensor
                value = input.lightLevel();
                low2 = 0;
                high2 = 255;
                break
            case InputSensor.AccelerationX:
                // Logic for acceleration in the X direction
                value = input.acceleration(Dimension.X);
                low2 = 0;
                high2 = 1023;
                break;
            case InputSensor.AccelerationY:
                // Logic for acceleration in the Y direction
                value = input.acceleration(Dimension.Y);
                low2 = 0;
                high2 = 1023;
                break;
            case InputSensor.AccelerationZ:
                // Logic for acceleration in the Z direction
                value = input.acceleration(Dimension.Z);
                low2 = 0;
                high2 = 1023;
                break;
            case InputSensor.AccelerationStrength:
                // Logic for acceleration strength
                value = input.acceleration(Dimension.Strength);
                low2 = 0;
                high2 = 1771;
                break;
            case InputSensor.Compass:
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
    * Re-maps all numbers in the array to a music scale on a number of octaves.
    * That is, the smallest number in the array would get mapped to the lowest tone on the music
    * scale specified, the largest number in the array would get mapped to the highest tone
    * on the same scale and values in-between to tones in-between.
    * @param list the array to be mapped, eg: []
    * @param key a number specifying the root frequency of the target scale, eg: 262
    * @param rule an array containing the frequency ratios, eg: sonification.chooseScale(sonification.Scale.Major)
    * @param octaves a number specifying the number of octaves, eg: 2
    */
    //% blockId=sonification-mapArray
    //% block="map $list to $key $rule || on $octaves octaves"
    //% inlineInputMode=inline
    //% key.shadow="device_note"
    //% key.defl=Note.C
    //% rule.shadow="sonification-chooseScale"
    //% octaves.defl="1"
    //% group="Map"
    //% help=github:sonification/docs/mapArray
    export function mapArray(list: number[], key: number, rule: number[], octaves?: number): number[] {
        let notes: any[] = [key];
        let f = 1;
        for (let o = 1; o <= octaves; o++) {
            for (let r = 0; r < rule.length; r++) {
                notes.push(Math.round(f * key * rule[r]));
            }
            f = f * 2;
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
     * @param value the number to be mapped
     * @param low a number specifying the lowest value in the range
     * @param high a number specifying the highest value in the range
     * @param key a number specifying the root frequency of the target scale, eg: 262
     * @param rule an array containing the frequency ratios, eg: sonification.chooseScale(sonification.Scale.Major)
     * @param octaves a number specifying the number of octaves, eg: 1
     */
    //% blockId=sonification-map
    //% block="map $value from low $low high $high to $key $rule || on $octaves octaves"
    //% inlineInputMode=inline
    //% key.shadow="device_note"
    //% key.defl=Note.C
    //% rule.shadow="sonification-chooseScale"
    //% octaves.defl="1"
    //% group="Map"
    //% help=github:sonification/docs/map
    export function map(value: number, low: number, high: number, key: number, rule: number[], octaves?: number): number {
        let notes2: any[] = [key];
        let f = 1;
        for (let p = 1; p <= octaves; p++) {
            for (let s = 0; s < rule.length; s++) {
                notes2.push(Math.round(f * key * rule[s]));
            }
            f = f * 2;
        }
        let mappedindex2 = Math.round(((value - low) / (high - low)) * (notes2.length - 1))
        return notes2[mappedindex2];
    }
    /**
     * Choose the input scale rule
     *  (an array containing the frequency ratios relative to the root frequency).
    */
    //% blockId=sonification-chooseScale
    //% block="$scale"
    //% group="Auxiliary"
    export function chooseScale(scale: Scale): number[] {
        let rule: any[] = [];
        switch (scale) {
            case Scale.Major: rule = [9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2];
                break;
            case Scale.Minor: rule = [9 / 8, 6 / 5, 4 / 3, 3 / 2, 8 / 5, 9 / 5, 2];
                break;
        }
        return rule;
    }
}
