import { FC, useState, useEffect } from 'react';
import { WeightChart, NutrientChart } from '../components';
import { createDateList } from '../app/func';
import { HistoryType } from '../app/types';
import siteData from '../app/util';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../app/db';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Home: FC = () => {
  // Init Date
  const current = new Date();
  const today = current.toLocaleDateString();
  current.setDate(current.getDate() - 7);
  const initStart = current.toLocaleDateString();

  // States
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(initStart), new Date(today)]);
  const [startDate, endDate] = dateRange;
  const [nutrientData, setNutrientData] = useState<HistoryType[]>([]);
  const [labelData, setLabelData] = useState<string[]>([]);

  // DB
  const historyData = useLiveQuery(() => db.history.toArray());

  // Update
  useEffect(() => {
    if (startDate === null || endDate === null || historyData === undefined) return;
    const dateList = createDateList(startDate.toLocaleDateString(), endDate.toLocaleDateString());
    setLabelData(dateList);
    const listData = dateList.map((date) => {
      let tempHistory: HistoryType = {
        date: date,
        weight: 0,
        protein: 0,
        sugar: 0,
        fat: 0,
        calorie: 0,
      };
      const targetHistory = historyData.filter((history) => history.date === date)[0];
      return targetHistory ? targetHistory : tempHistory;
    });
    setNutrientData(listData);
  }, [startDate, endDate, historyData]);

  return (
    <div className="home">
      <div className="term">
        <DatePicker
          dateFormat="yyyy/MM/dd"
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
        />
      </div>
      <div className="weight_chart">
        <WeightChart label={labelData} data={nutrientData} />
      </div>
      <div className="nutrient_chart">
        <NutrientChart label={labelData} data={nutrientData} />
      </div>
    </div>
  );
};
export default Home;
