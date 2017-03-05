class HelperService {

    constructor() {}

    timespanToHumanString(date) {

        let time = new Date() - new Date(date) - 0.5,
            second = time / 1000,
            minute, hour, day, month, year, rez;

        if (second <= 45) {
            rez = 'a few seconds'
        } else {
            minute = second / 60;
            if (minute <= 45) {
                rez = Math.round(minute) === 1 ? 'a minute' : `${Math.round(minute)} minutes`;
            } else {
                hour = minute / 60;
                if (hour <= 22) {
                    rez = Math.round(hour) === 1 ? 'an hour' : `${Math.round(hour)} hours`;
                } else {
                    day = hour / 24;
                    if (day <= 25) {
                        rez = Math.round(day) === 1 ? 'a day' : `${Math.round(day)} days`;
                    } else {
                        if (day <= 345) {
                            rez = Math.round(day / 30) === 1 ? 'a month' : `${Math.round(day / 30)} months`;
                        } else {
                            if (day <= 36000) {
                                rez = Math.round(day / 364) === 1 ? 'a year' : `${Math.round(day / 364)} years`;
                            }
                        }
                    }
                }
            }
        }

        return rez + ' ago'
    }
}

export default new HelperService();