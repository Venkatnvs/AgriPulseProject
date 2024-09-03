import AXIOS_INSTANCE from '../axios';

export const fetchDashBoardCardCounts = (from, to) => 
    AXIOS_INSTANCE.get(`/core/dashboard/card-counts/?start_date=${from}&end_date=${to}`);

export const fetchDashBoardGraphData = (from, to) =>
    AXIOS_INSTANCE.get(`/core/dashboard/main-charts/?start_date=${from}&end_date=${to}`);