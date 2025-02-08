export const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 获取 24 点或 96 点的时间列表
 * @param interval 24点还是96点，默认是24点
 * @param mode 设置成 start 时，以"00:00"开头，以"23:xx"结尾，设置成 end 时，以"00:xx"开头，以"24:00"结尾
 * @returns 时间数组，如: ['00:15','00:30',...,'24:00']
 */
export function generateTimeArray(interval: 24 | 96 = 24, mode: 'start' | 'end' = 'end'): string[] {
  const timeSlots: string[] = [];
  const minutesPerSlot = interval === 24 ? 60 : 15;

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += minutesPerSlot) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      timeSlots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  if (mode === 'end') {
    timeSlots.shift();
    timeSlots.push('24:00');
  }

  return timeSlots;
}

export const TIME_ARRAY_24_END = generateTimeArray(24, 'end');
export const TIME_ARRAY_24_END_SHORT = generateTimeArray(24, 'end').map((item) => parseInt(item).toString());
export const TIME_ARRAY_96_END = generateTimeArray(96, 'end');

/**
 * 获取本周第一天和最后一天的日期
 * @param date 默认值为当前日期
 * @returns [string, string] ,例如 ['2023-09-04', '2023-09-10']
 */

export function getFirstAndLastDayOfWeek(date: Date | number | string = new Date()): [string, string] {
  const inputDate = new Date(date);
  const currentDay = inputDate.getDay(); // 0 表示周日，1 表示周一，以此类推

  // 计算本周的第一天（周一）
  const firstDayOfWeek = new Date(inputDate);
  const diff = currentDay === 0 ? 6 : currentDay - 1;
  firstDayOfWeek.setDate(inputDate.getDate() - diff);

  // 计算本周的最后一天（周日）
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

  // 格式化日期为 'YYYY-MM-DD'
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const firstDay = formatDate(firstDayOfWeek);
  const lastDay = formatDate(lastDayOfWeek);

  return [firstDay, lastDay];
}

/**
 * 获取本周第一天和当前日期，当前日期可以前后浮动，但是不会超过本周的范围
 * @param date 默认值为当前日期
 * @param dayCount 默认值为0，即不偏移
 * @returns 本周第一天和当前日期，当前日期可以前后浮动，但是不会超过本周的范围
 */
export function getFirstAndLastDayOfWeekWithoutNext(date: Date | number | string = new Date(), dayCount = 0): [string, string] {
  const today = new Date(date);
  let currentDay = today.getDay(); // 获取今天是星期几 (0 = 星期天, 1 = 星期一, ..., 6 = 星期六)

  if (currentDay === 0) {
    currentDay = 7; // 将星期天的值从0更改为7
  }

  // 计算星期一的日期
  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - (currentDay - 1));

  // 计算星期日的日期
  const maxTargetDay = new Date(firstDay);
  maxTargetDay.setDate(firstDay.getDate() + 6);

  let targetDay = new Date(today);
  targetDay.setDate(today.getDate() + dayCount);

  // 确保 targetDay 不超过本周的范围
  if (targetDay < firstDay) {
    targetDay = firstDay;
  } else if (targetDay > maxTargetDay) {
    targetDay = maxTargetDay;
  }

  // 格式化日期为 'YYYY-MM-DD'
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const firstDayOfWeek = formatDate(firstDay);
  const targetDayOfWeek = formatDate(targetDay);

  return [firstDayOfWeek, targetDayOfWeek];
}

/**
 * 获取指定月份的第一天和最后一天
 * @param yearMonth 年月，例如"202009"
 * @returns { firstDay: string; lastDay: string } 当前月份第一天和最后一天，例如 { firstDay: '20200901', lastDay: '20200930 }
 */
export function getFirstAndLastDayOfMonth(date: Date | number | string = new Date()): [string, string] {
  const inputDate = new Date(date);
  const year = inputDate.getFullYear();
  const month = inputDate.getMonth() + 1; // 月份从0开始，所以要加1
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };
  return [formatDate(firstDay), formatDate(lastDay)];
}

/**
 * 将年的范围转换为包含期间的每个年的数组
 * @param startYear 开始日期，例如：'2022'
 * @param endYear 结束日期，例如：'2022'
 * @returns 期间的所有日期数组，例如 ['2022', '2023']
 */
export function getYearsInRange(startYear: number | string | Date, endYear: number | string | Date): string[] {
  const years = [];
  const start = new Date(startYear).getFullYear();
  const end = new Date(endYear).getFullYear();
  for (let i = start; i <= end; i++) {
    years.push(i.toString());
  }
  return years;
}

/**
 * 将日期范围转换为包含期间的每个日期的数组
 * @param startDate 开始日期，例如：'2023-09-04'
 * @param endDate 结束日期，例如：'2023-09-06'
 * @returns 期间的所有日期数组，例如 ['2023-09-04', '2023-09-05', '2023-09-06']
 */
export function getDatesInRange(startDate: string | Date | number, endDate: string | Date | number): string[] {
  const dateArray: string[] = [];
  const currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);

  while (currentDate <= endDateObj) {
    const year = String(currentDate.getFullYear());
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    dateArray.push(formattedDate);

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

/**
 * 将日期范围转换为包含期间的每个日期的数组
 * @param startDate 开始日期，例如：'2023-09'
 * @param endDate 结束日期，例如：'2023-11'
 * @returns 期间的所有月份数组，例如 ['2023-09', '2023-10', '2023-11']
 */
export function getMonthsInRange(startDate: Date | string | number, endDate: Date | string | number): string[] {
  const startDateObj = new Date(startDate);
  const firstDayOfMonth = new Date(startDateObj.getFullYear(), startDateObj.getMonth(), 1);

  const endDateObj = new Date(endDate);
  const lastDayOfMonth = new Date(endDateObj.getFullYear(), endDateObj.getMonth() + 1, 0);

  const months: string[] = [];
  const currentDate = firstDayOfMonth;

  while (currentDate <= lastDayOfMonth) {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    months.push(`${year}-${month}`);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return months;
}

/**
 * 获取指定日期列表中包含的日期列表
 * @param dates 日期列表
 * @returns 日期列表中所包含的月份列表
 */
export function getMonthsByDates(dates: string[]): string[] {
  const months: string[] = [];

  for (const date of dates) {
    const month = date.slice(0, 7); // 提取年份和月份部分，例如 "2023-01"
    if (!months.includes(month)) {
      months.push(month);
    }
  }

  return months;
}

/**
 * 将日期范围转换为包含期间的每个日期的数组
 * @param months 月份列表，例如：['2023-09', '2023-10', '2023-11']
 * @returns 入参月份中的所有天，例如 ['2023-09-01', '2023-09-02', '2023-09-03',..., '2023-11-30']
 */
export function getDatesInMonths(months: string[]): string[] {
  const dates: string[] = [];

  for (const month of months) {
    const [year, monthStr] = month.split('-');
    const daysInMonth = new Date(parseInt(year), parseInt(monthStr), 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day.toString().padStart(2, '0');
      dates.push(`${year}-${monthStr}-${dayStr}`);
    }
  }

  return dates.sort();
}

/**
 * 将日期范围转换为包含期间的每个日期的数组
 * @param months 月份列表，例如：['2023', '2024']
 * @returns 入参月份中的所有天，例如 ['2023-01', '2023-02', '2023-03',..., '2024-12']
 */
export function getMonthsInYears(years: string[]): string[] {
  const months: string[] = [];
  for (const year of years) {
    for (let i = 1; i <= 12; i++) {
      const month = i.toString().padStart(2, '0');
      months.push(`${year}-${month}`);
    }
  }
  return months.sort();
}

/**
 * 将日期范围转换为包含期间的每个日期的数组（可偏移）
 * @param months 月份列表，例如：['2023', '2024']
 * @param dayCount 偏移天数，默认到今天
 * @returns 入参月份中的所有天，例如 ['2023-01', '2023-02', '2023-03',..., '2023-11']，跟随偏移天数会调整
 */
export function getMonthsInYearsWithoutNext(years: string[], daysOffset = 0): string[] {
  const months: string[] = [];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + daysOffset);
  for (const year of years) {
    for (let month = 1; month <= 12; month++) {
      const targetMonth = new Date(parseInt(year), month - 1, 1);
      if (targetMonth <= currentDate) {
        const monthStr = month.toString().padStart(2, '0');
        months.push(`${year}-${monthStr}`);
      }
    }
  }
  return months.sort();
}

/**
 * 将日期范围转换为包含期间的每个日期的数组（可偏移）
 * @param months 月份列表，例如：['2023-09', '2023-10', '2023-11']
 * @param dayCount 偏移天数，默认到今天
 * @returns 入参月份中的所有天，例如 ['2023-09-01', '2023-09-02', '2023-09-03',..., '2023-11-30']，跟随偏移天数会调整
 */
export function getDatesInMonthsWithoutNext(months: string[], dayCount = 0): string[] {
  const dates: string[] = [];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + dayCount);

  for (const month of months) {
    const [year, monthStr] = month.split('-');
    const daysInMonth = new Date(parseInt(year), parseInt(monthStr), 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const targetDate = new Date(parseInt(year), parseInt(monthStr) - 1, day);
      if (targetDate <= currentDate) {
        const dayStr = day.toString().padStart(2, '0');
        dates.push(`${year}-${monthStr}-${dayStr}`);
      }
    }
  }

  return dates.sort();
}

export function convertSecondsToTime(time: number) {
  const seconds = Math.floor(time / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds / 3600) - days * 24;
  const minutes = Math.floor(seconds / 60) - hours * 60 - days * 24 * 60;
  const remainingSeconds = seconds % 60;
  return (
    (days ? days + '天' : '') + (hours ? hours + '小时' : '') + (minutes ? minutes + '分钟' : '') + (remainingSeconds ? remainingSeconds + '秒' : '')
  );
}
