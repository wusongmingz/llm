import { ISearchForm } from '@/components/AAUI';
import {
  getDatesInMonthsWithoutNext,
  getDatesInRange,
  getFirstAndLastDayOfWeekWithoutNext,
  getMonthsByDates,
  getMonthsInRange,
} from '@/utils/timeTools';
import { dayjs } from 'element-plus';
import { ref, computed, watch } from 'vue';

/**
 * 用于限制 范围日期选择框 的可选日期范围和日期长度
 * @param startDate 可选的起始日期
 * @param endDate 可选的结束日期
 * @param dateLength 可选的最大长度
 * @returns element plus 所需的配置项，将这两项绑定到 Date Picker 组件上即可
 */
export function useDateSelectDisabled(
  startDate: Date | string,
  endDate: Date | string,
  dateLength: number,
): { onCalendarChange: (date: [Date, Date]) => void; disabledDate: (date: Date) => boolean };

export function useDateSelectDisabled(startDate: Date | string, endDate: Date | string): { disabledDate: (date: Date) => boolean };

export function useDateSelectDisabled(dateLength: number): {
  onCalendarChange: (date: [Date, Date]) => void;
  disabledDate: (date: Date) => boolean;
};

export function useDateSelectDisabled(startDate: Date | string | number, endDate?: Date | string, dateLength?: number) {
  const dateSelectValue = ref<Date>();
  const onCalendarChange = (date: [Date, Date]) => {
    const minDate = date[0];
    const maxDate = date[1];
    dateSelectValue.value = minDate;
    if (maxDate) dateSelectValue.value = undefined;
  };
  let disabledDate: (date: Date) => boolean;
  if (arguments.length === 3 && dateLength && endDate) {
    disabledDate = (date: Date): boolean => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (dateSelectValue.value) {
        const dealDateFront = new Date(dateSelectValue.value.getTime() - dateLength * 24 * 60 * 60 * 1000);
        const dealDateEnd = new Date(dateSelectValue.value.getTime() + dateLength * 24 * 60 * 60 * 1000);
        if (date <= end && date >= start && date <= dealDateEnd && date >= dealDateFront) return false;
        else return true;
      }
      if (date <= end && date >= start) return false;
      else return true;
    };
  } else if (arguments.length === 2 && endDate) {
    disabledDate = (date: Date): boolean => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (date <= end && date >= start) return false;
      else return true;
    };
    return { disabledDate };
  } else if (arguments.length === 1 && typeof startDate === 'number') {
    disabledDate = (date: Date): boolean => {
      if (dateSelectValue.value) {
        const dealDateFront = new Date(dateSelectValue.value.getTime() - startDate * 24 * 60 * 60 * 1000);
        const dealDateEnd = new Date(dateSelectValue.value.getTime() + startDate * 24 * 60 * 60 * 1000);
        if (date <= dealDateEnd && date >= dealDateFront) return false;
        else return true;
      } else {
        return false;
      }
    };
  } else {
    throw Error('useDateSelectDisabled使用错误');
  }
  return { onCalendarChange, disabledDate };
}

export const useYearMonthSelectOption = () => {
  const searchData = ref({
    dates: getDatesInRange(...getFirstAndLastDayOfWeekWithoutNext()),
    months: getMonthsByDates(getDatesInRange(...getFirstAndLastDayOfWeekWithoutNext())),
  });
  // 时间选项生成
  const monthOption = getMonthsInRange('2023-01', dayjs().add(3, 'day').toDate())
    .map((item) => ({ label: item, value: item }))
    .reverse();
  const dateOption = computed(() => {
    return getDatesInMonthsWithoutNext(searchData.value.months, 3)
      .map((item) => ({ label: item, value: item }))
      .reverse();
  });
  watch(
    () => searchData.value.months,
    () => (searchData.value.dates = getDatesInMonthsWithoutNext(searchData.value.months, 3)),
  );
  const searchList = computed<ISearchForm[]>(() => [
    {
      label: '年月',
      prop: 'months',
      type: 'selectWithAll',
      selectOption: { options: monthOption },
      option: { collapseTags: true, collapseTagsTooltip: true },
    },
    {
      label: '日期',
      prop: 'dates',
      type: 'selectWithAll',
      selectOption: { options: dateOption.value },
      option: { collapseTags: true, collapseTagsTooltip: true },
    },
  ]);
  return {
    searchList,
    searchData,
  };
};
