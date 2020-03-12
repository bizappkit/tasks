import { setDate, setTime } from "./dateTimeUtils";

test('set time', () => {

    let dateTime = setTime(new Date(), "9")
    expect(dateTime.getHours()).toEqual(9)
    expect(dateTime.getMinutes()).toEqual(0)

    dateTime = setTime(new Date(), "9:00")
    expect(dateTime.getHours()).toEqual(9)
    expect(dateTime.getMinutes()).toEqual(0)
});

test('set date', () => {

    let dateTime = setDate(new Date(), "2020-09-01")
    expect(dateTime.getMonth()).toEqual(8) //starts from 0
    expect(dateTime.getDate()).toEqual(1)
    expect(dateTime.getFullYear()).toEqual(2020)
});