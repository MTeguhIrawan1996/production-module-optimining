import dayjs from './dayjs.config';

export const getWeeksInMonth = (year: string, month: string) => {
  // Mendapatkan tanggal pertama dari bulan tersebut
  const firstDayOfMonth = dayjs()
    .year(Number(year))
    .month(Number(month) - 1)
    .startOf('month');

  const lastDateOfMonth = dayjs()
    .year(Number(year))
    .month(Number(month) - 1)
    .endOf('month');

  // Mendapatkan hari keberapa tanggal pertama tersebut dalam seminggu (0: Minggu, 1: Senin, dst.)
  const firstDayOfWeek = firstDayOfMonth.day();
  // mendapatkan hari pertama tersebut berada pada minggu ke berapa dalam setahun
  const firstWeekOfMonth = firstDayOfMonth.week();
  const lastWeekOfMonth = lastDateOfMonth.week();

  // Menghitung jumlah hari dalam bulan tersebut
  const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();

  // console.log(firstWeekOfMonth);
  // console.log(lastWeekOfMonth);
  // console.log((daysInMonth + firstDayOfWeek) / 7);

  // Menghitung jumlah minggu berdasarkan jumlah hari dalam bulan dan hari pertama dalam seminggu
  const weeks =
    firstWeekOfMonth >= lastWeekOfMonth
      ? Math.ceil((daysInMonth + firstDayOfWeek) / 7) - 1
      : Math.ceil((daysInMonth + firstDayOfWeek) / 7);

  // console.log(weeks);

  // Membuat array yang berisi nomor-nomor minggu dalam bulan tersebut
  const weeksArray = Array.from(
    { length: weeks },
    (_, index) => index + firstWeekOfMonth
  );

  return weeksArray;
};

interface IFO {
  week: number;
  startDate: string;
  endDate: string;
}

export const getRangeDateOfWeek = ({
  year,
  month,
}: {
  year: string;
  month: string;
}) => {
  const arrayWeek = getWeeksInMonth(`${year}`, `${month}`);
  return arrayWeek.reduce<IFO[]>((acc, week) => {
    const startDate = dayjs()
      .year(Number(year))
      .week(Number(week))
      .startOf('week');

    const endDate = startDate.add(6, 'day');

    // return {
    //   startDate: startDate.toISOString(),
    //   endDate: endDate.toISOString(),
    // };

    return [
      ...acc,
      {
        week: week,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      },
    ];
  }, []);
};
