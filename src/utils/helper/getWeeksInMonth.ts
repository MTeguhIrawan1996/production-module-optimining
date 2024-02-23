import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
// import weekYear from 'dayjs/plugin/weekYear';
// import 'dayjs/locale/id';
// dayjs.locale('id');
// dayjs.extend(weekYear);
dayjs.extend(weekOfYear);

export const getWeeksInMonth = (year: number, month: number) => {
  // Menghitung jumlah hari dalam bulan tersebut
  const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();

  // Mendapatkan tanggal pertama dari bulan tersebut
  const firstDayOfMonth = dayjs(`${year}-${month}-01`);

  // Mendapatkan hari keberapa tanggal pertama tersebut dalam seminggu (0: Minggu, 1: Senin, dst.)
  const firstDayOfWeek = firstDayOfMonth.day();

  // Menghitung jumlah minggu berdasarkan jumlah hari dalam bulan dan hari pertama dalam seminggu
  const weeks = Math.ceil((daysInMonth + firstDayOfWeek) / 7);

  // Membuat array yang berisi nomor-nomor minggu dalam bulan tersebut
  const weeksArray = Array.from({ length: weeks }, (_, index) => index + 1);

  return weeksArray;
};

// Januari = [1,2,3,4,5]
// Februari = [5,6,7,8,9]
// dst sesuai parameter tahun dan bulan

// // februari dimulai dari minggu ke 5 karena pada bulan februari tahun 2024, hari pada tanggal pertama ada di pertengahan minggu
