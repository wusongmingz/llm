import { energyRequest } from '@/utils/request';

export function getReviewReportList(params: { unitName: string; pageNo: number; pageSize: number }) {
  return energyRequest<{ total: number; records: { id: number; title: string; reportVars: string }[] }>({
    url: '/review/pageReviewReport',
    method: 'GET',
    params,
  });
}

export function saveReviewReport(data: FormData) {
  return energyRequest<void>({
    url: '/review/saveReviewReport',
    method: 'POST',
    data,
  });
}
