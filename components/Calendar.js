import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FlatList } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import ArrowIcon from '../assets/icons/previous_arrow_ico.svg';
import BottomAngleBracket from '../assets/icons/bottom_angle_bracket.svg';
import LeftAngleBracket from '../assets/icons/Left_angle_bracket.svg';
import RightAngleBracket from '../assets/icons/Left_angle_bracket.svg';
import TopAngleBracket from '../assets/icons/bottom_angle_bracket.svg';
import WheelPicker from 'react-native-wheely';

const CalendarSection = styled.View`
  width: 100%;
  padding: 0 10px;

  padding-bottom: 20px;
`;

const CalendarWeekday = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-family: 'Pretendard-Medium';
  color: #97989a;
`;

const ModalSubtitle = styled.Text`
  font-size: 16px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
  text-align: center;
  margin: 20px 0;
`;
const SelectGroup = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 10px 20px;
`;


const SelectLabel = styled.Text`
  font-size: 12px;
  font-family: Pretendard-Medium;
  color: #1b1c1f;
  line-height: 20px;
`;

const PickerContainer = styled.View`
  width: 100%; 
  height: 200;
  background-color: #f5f7fa;
  border-radius: 10px;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
`;
const Calendar = props => {
  // ////console.log('props.currentDate', props.currentDate);
  //////console.log('props.currentDate', props.currentDate);

  const [currentDate, setCurrentDate] = useState(props.currentDate ? new Date(props.currentDate) : new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(props.selectedDate ? new Date(props.selectedDate) : new Date());
  
  const currentday = currentDate.getDate();
  const currentyear = currentDate.getFullYear();
  const currentmonth = currentDate.getMonth();
  const minYear = props?.minDate ? new Date(props.minDate).getFullYear() : currentyear;
  const maxYear = props?.maxDate ? new Date(props.maxDate).getFullYear() : currentyear;
  const minMonth = props?.minDate ? new Date(props.minDate).getMonth() : 0;
  const maxMonth = props?.maxDate ? new Date(props.maxDate).getMonth() : 11;
  const isFirstRender = useRef(true);
  let updatedMonths = [];
  //console.log('firstselectedDate', selectedDate);

  const init = () => {
    let newMonths = [];
    let newYears = [];
    //console.log('{{{{{{{{{{minMonth && maxMonth}}}}}}}}}}}}}}}', minMonth, maxMonth);
    if ((props?.minDate || props?.maxDate)) {
      if (props?.minDate && !props?.maxDate) {
        for (let i = minYear; i <= minYear + 50; i++) {
          newYears.push(i);
        }
        for (let i = minMonth + 1; i <= 12; i++) {
          newMonths.push(i);
        }
        ////console.log('check1');
      } else if (props?.maxDate && !props?.minDate) {
        for (let i = currentyear - 50; i <= maxYear; i++) {
          newYears.push(i);
        }
        if (selectedDate) {
          //console.log('props?.maxDate', props?.maxDate);
          if (props?.maxDate?.getFullYear() === selectedDate?.getFullYear()) {
            for (let i = 1; i <= maxMonth + 1; i++) {
              newMonths.push(i);
              //console.log('newMonths', newMonths);
            }
          } else {
            for (let i = 1; i <= 12; i++) {
              newMonths.push(i);
              //console.log('newMonths', newMonths); 
            }
          }
        } else {
          if (props?.maxDate?.getFullYear() === currentDate?.getFullYear()) {
            for (let i = 1; i <= maxMonth + 1; i++) {
              newMonths.push(i);
              //console.log('newMonths', newMonths);
            }
          } else {
            for (let i = 1; i <= 12; i++) {
              newMonths.push(i);
              //console.log('newMonths', newMonths);
            }
          }
        }

        ////console.log('check2');
      } else {
        for (let i = minYear; i <= maxYear; i++) {
          newYears.push(i);
        }

        if (selectedDate) {
          if (new Date(props?.minDate).getFullYear() === selectedDate?.getFullYear() || new Date(props?.maxDate).getFullYear() === selectedDate?.getFullYear()) {
            if (new Date(props?.minDate).getFullYear() === new Date(props?.maxDate).getFullYear() && new Date(props?.minDate).getFullYear() === selectedDate?.getFullYear()) {
              for (let i = minMonth + 1; i <= maxMonth + 1; i++) {
                newMonths.push(i);
              }
            } else if (new Date(props?.minDate).getFullYear() === selectedDate?.getFullYear()) {
              for (let i = minMonth + 1; i <= 12; i++) {
                newMonths.push(i);
              }
            } else if (new Date(props?.maxDate).getFullYear() === selectedDate?.getFullYear()) {
              for (let i = 1; i <= maxMonth + 1; i++) {
                newMonths.push(i);
              }
            }

          }
        }

        /* else {
           if (props?.maxDate?.getFullYear() === currentDate?.getFullYear()) {
             for (let i = minMonth; i <= maxMonth + 1; i++) {
               newMonths.push(i);
               //console.log('newMonths', newMonths);
             }
           } else {
             for (let i = minMonth; i <= 12; i++) {
               newMonths.push(i);
               //console.log('newMonths', newMonths);
             }
           }
         }*/
        ////console.log('check3');
      }
    } else {
      for (let i = currentyear - 50; i <= currentyear + 50; i++) {
        newYears.push(i);
      }
      for (let i = 1; i <= 12; i++) {
        newMonths.push(i);
      }
      ////console.log('check4');
    }
    setMonths(newMonths);
    setYears(newYears);
  }
  const getDaysInMonth = (day, month, year, selectedDate, currentyear, currentmonth) => {
    let date = day && (year === selectedDate?.getFullYear()) && (month === selectedDate?.getMonth()) ? new Date(year, month, props.minDate ? day : 1) : new Date(selectedDate ? selectedDate?.getFullYear() : currentyear, selectedDate ? selectedDate?.getMonth() : currentmonth, 1);
    let days = [];
    if (props.minDate || props.maxDate) {
      if (props.minDate && !props.maxDate) {
        while (date.getMonth() === selectedDate?.getMonth() && date.getFullYear() === selectedDate?.getFullYear()) {
          days.push(date.getDate());
          date.setDate(date.getDate() + 1);
        }
      } else if (props.maxDate && !props.minDate) {
        while (date.getMonth() === month && date.getFullYear() === year && date <= props.maxDate) {
          days.push(date.getDate());
          date.setDate(date.getDate() + 1);
        }
      } else if (props.maxDate && props.minDate) {
        while (date.getMonth() === selectedDate?.getMonth() && date.getFullYear() === selectedDate?.getFullYear() && date <= props.maxDate) {
          days.push(date.getDate());
          date.setDate(date.getDate() + 1);
        }
      }
      /*else if (props.maxDate && !props.minDate) {
        while (date.getMonth() === selectedDate?.getMonth() && date.getFullYear() === selectedDate?.getFullYear() && date <= props.maxDate) {
          ////console.log('innerdate', date);
          days.push(date.getDate());
          date.setDate(date.getDate() + 1);
        }
      }  mindate와 maxdate가 존재하는 케이스 필요시 추가
*/
    } else {
      while (date.getMonth() === month) {
        days.push(date.getDate());
        date.setDate(date.getDate() + 1);
      }
    }
    return days;
  };

  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(props.minDate ? new Date(props.minDate).getDate() : currentday, props.minDate ? new Date(props.minDate).getMonth() : currentmonth, props.minDate ? new Date(props.minDate).getFullYear() : currentyear, selectedDate, currentyear, currentmonth));

  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);


  // //console.log('daysInMonth', daysInMonth);
  // //console.log('years', years);
  // //console.log('months', months);

  ////console.log('maxMonth', maxMonth);
  useEffect(() => {
    init(minMonth, maxMonth);
  }, []);

  useEffect(() => {

    if (new Date(props?.minDate).getFullYear() === selectedDate?.getFullYear() || new Date(props?.maxDate).getFullYear() === selectedDate?.getFullYear()) {
      if (new Date(props?.minDate).getFullYear() === new Date(props?.maxDate).getFullYear() && new Date(props?.minDate).getFullYear() === selectedDate?.getFullYear()) {
        for (let i = minMonth + 1; i <= maxMonth + 1; i++) {
          updatedMonths.push(i);
        }
      } else if (new Date(props?.minDate).getFullYear() === selectedDate?.getFullYear()) {
        for (let i = minMonth + 1; i <= 12; i++) {
          updatedMonths.push(i);
        }
      } else if (new Date(props?.maxDate).getFullYear() === selectedDate?.getFullYear()) {
        for (let i = 1; i <= maxMonth + 1; i++) {
          updatedMonths.push(i);
        }
      }

    } else {
      for (let i = 1; i <= 12; i++) {
        updatedMonths.push(i);
      }
    }
    setMonths(updatedMonths);
  }, [selectedDate?.getFullYear()]);


  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  useEffect(() => {
    setCurrentPageIndex(props?.currentPageIndex ? props?.currentPageIndex : 0);
    generateDatesInRange();
  }, [currentDate, props?.currentPageIndex]);

  useEffect(() => {

    if (props.minDate) {
      setDaysInMonth(getDaysInMonth(new Date(props.minDate).getDate(), new Date(props.minDate).getMonth(), new Date(props.minDate).getFullYear(), selectedDate, currentyear, currentmonth));
    } else {
      setDaysInMonth(getDaysInMonth(selectedDate ? selectedDate?.getDate() : currentday, selectedDate ? selectedDate?.getMonth() : currentmonth, selectedDate ? selectedDate?.getFullYear() : currentyear, selectedDate, currentyear, currentmonth));
    }
  }, [selectedDate?.getFullYear(), selectedDate?.getMonth()]);

  useEffect(() => {
    props.setSelectedDate(selectedDate);
  }, [selectedDate]);
  
  
  const CalendarHeader = () => {
    const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 32,
          paddingHorizontal: 10,
          marginTop: 10,
        }}>
        {DAYS.map((day, index) => (
          <CalendarWeekday key={index}>{day}</CalendarWeekday>
        ))}
      </View>
    );
  };
  const generateDatesInRange = () => {
    const dates = [];
    for (
      let date = new Date(firstSunday);
      date <= lastSaturday;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date));
    }

    setCalendarData(dates);
  };
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  // 주의 첫 번째 일요일 찾기
  const firstSunday = new Date(firstDayOfMonth);
  firstSunday.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
  const lastSaturday = new Date(lastDayOfMonth);
  lastSaturday.setDate(
    lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()),
  );

  const renderDay = ({ item }) => {
    // console.log('props.minDate', props.minDate);
    const isPast = item < props.minDate;
    const islimit = item > props.maxDate;
    const isSunday = item.getDay() === 0;
    const isSaturday = item.getDay() === 6;
    const isSelected = item.toDateString() === selectedDate?.toDateString();
    return (
      <Pressable
        disabled={(props.minDate ? isPast : false) || (props.maxDate ? islimit : false)}
        onPress={() => {
          setSelectedDate(item);
          // ////console.log('item', item);
        }}
        style={{
          flex: 1,
          backgroundColor: '#fff',
          height: 42,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 21,
            backgroundColor: isSelected ? '#1B1C1F' : '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text

            style={[
              {
                fontSize: 16,
                fontFamily: 'Pretendard-Regular',
                color: isSelected ? '#fff' : '#CFD1D5',
                textAlign: 'center',
              },
              !(isPast || islimit)
                ? {
                  color: isSelected
                    ? '#fff'
                    : isSaturday
                      ? '#4E63FF'
                      : isSunday
                        ? '#FF2C65'
                        : '#545463',
                }
                : null,
            ]}>
            {item.getDate()}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      {currentPageIndex === 0 && (
        <>
          <View
            style={{
              width: '100%',
              borderTopWidth: 1,
              borderTopColor: '#E8EAED',
              paddingHorizontal: 10,

            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                alignSelf: 'center',

              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={{
                  top: 20,
                  bottom: 20,
                  left: 20,
                  right: 20,
                }}
                onPress={() => {
                  setCurrentDate(dayjs(currentDate).subtract(1, 'M').toDate());
                }}

              >
                <LeftAngleBracket />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ModalSubtitle style={{ marginRight: 10 }} >
                  {currentDate.getFullYear() === selectedDate.getFullYear() && currentDate.getMonth() === selectedDate.getMonth() ? dayjs(selectedDate).format('YYYY년 MM월 DD일') : dayjs(currentDate).format('YYYY년 MM월')}
                </ModalSubtitle>
                {props.ReservationYn !== 'N' && (<BottomAngleBracket hitSlop={{
                  top: 20,
                  bottom: 20,
                  left: 20,
                  right: 20,
                }} onPress={() => { setCurrentPageIndex(1) }} />)}
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={{
                  top: 20,
                  bottom: 20,
                  left: 20,
                  right: 20,
                }}
                onPress={() => {
                  setCurrentDate(dayjs(currentDate).add(1, 'M').toDate());
                }}

              >
                <RightAngleBracket
                  style={{
                    transform: [{ rotate: '180deg' }],
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <CalendarHeader />
          <CalendarSection>
            <FlatList
              key={currentDate.getMonth()}
              scrollEnabled={true}
              data={calendarData}
              numColumns={7}
              keyExtractor={item => item.toISOString()}
              renderItem={renderDay}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              nestedScrollEnabled={true} // 추가
            />
          </CalendarSection>
        </>
      )}

      {currentPageIndex === 1 && (
        <>
          <View
            style={{
              width: 'auto',
              borderTopWidth: 1,
              borderTopColor: '#E8EAED',
              paddingHorizontal: 10,
            }}>
            <View
              style={{
                width: 'auto',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                alignSelf: 'center',

              }}>
              <TouchableOpacity>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 10 }}>
                <ModalSubtitle style={{ marginRight: 10 }} >
                  {selectedDate ? dayjs(selectedDate).format('YYYY년 MM월 DD일') : dayjs(currentDate).format('YYYY년 MM월')}
                </ModalSubtitle>
                {props.ReservationYn !== 'N' && (<TopAngleBracket hitSlop={{
                  top: 20,
                  bottom: 20,
                  left: 20,
                  right: 20,
                }} onPress={() => {
                  ////console.log('currentPageIndex', currentPageIndex);
                  setCurrentPageIndex(0);
                  setCurrentDate(selectedDate ? selectedDate : currentDate);
                }}
                  style={{
                    transform: [{ rotate: '180deg' }],
                  }} />)}
                <TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>
            <SelectGroup>
              <View style={{ width: '40%', marginRight: 10 }}>
                <SelectLabel >연도</SelectLabel>
                <PickerContainer>
                  <WheelPicker
                    key={years}
                    selectedIndex={
                      selectedDate ? years.indexOf(selectedDate.getFullYear()) >= 0 ? years.indexOf(selectedDate.getFullYear()) : 1 : years.indexOf(currentDate.getFullYear())
                    }
                    containerStyle={{
                      width: 120,
                      height: 440,
                      borderRadius: 10,
                    }}
                    itemTextStyle={{
                      fontFamily: 'Pretendard-Regular',
                      fontSize: 18,
                      color: '#1B1C1F',
                    }}
                    allowFontScaling={false}
                    selectedIndicatorStyle={{
                      backgroundColor: 'transparent',
                    }}
                    itemHeight={40}
                    options={years}
                    onChange={index => {
                      if (props.minDate) {
                        if (years[index] === new Date(props.minDate).getFullYear()) {
                          if (selectedDate?.getMonth() < new Date(props.minDate).getMonth()) {
                            if (selectedDate?.getDate() < new Date(props.minDate).getDate()) {
                              setSelectedDate(new Date(years[index], new Date(props.minDate).getMonth(), new Date(props.minDate).getDate()));
                            } else {
                              setSelectedDate(new Date(years[index], new Date(props.minDate).getMonth(), selectedDate ? selectedDate?.getDate() : currentday));
                            }
                          } else {
                            if (selectedDate?.getDate() < new Date(props.minDate).getDate()) {
                              setSelectedDate(new Date(years[index], selectedDate ? selectedDate?.getMonth() : currentmonth, new Date(props.minDate).getDate()));
                            } else {
                              setSelectedDate(new Date(years[index], selectedDate ? selectedDate?.getMonth() : currentmonth, selectedDate ? selectedDate?.getDate() : currentday));
                            }
                          }
                        } else {
                          setSelectedDate(new Date(years[index], selectedDate ? selectedDate?.getMonth() : currentmonth, selectedDate ? selectedDate?.getDate() : currentday));
                        }
                      } else if (props.maxDate) {
                        if (years[index] === new Date(props.maxDate).getFullYear()) {
                          if (selectedDate?.getMonth() > new Date(props.maxDate).getMonth()) {
                            if (selectedDate?.getDate() > new Date(props.maxDate).getDate()) {
                              setSelectedDate(new Date(years[index], new Date(props.maxDate).getMonth(), new Date(props.maxDate).getDate()));
                            } else {
                              setSelectedDate(new Date(years[index], new Date(props.maxDate).getMonth(), selectedDate ? selectedDate?.getDate() : currentday));
                            }
                          } else {
                            if (selectedDate?.getDate() > new Date(props.maxDate).getDate()) {
                              setSelectedDate(new Date(years[index], selectedDate ? selectedDate?.getMonth() : currentmonth, new Date(props.maxDate).getDate()));
                            } else {
                              setSelectedDate(new Date(years[index], selectedDate ? selectedDate?.getMonth() : currentmonth, selectedDate ? selectedDate?.getDate() : currentday));
                            }
                          }
                        } else {
                          setSelectedDate(new Date(years[index], selectedDate ? selectedDate?.getMonth() : currentmonth, selectedDate ? selectedDate?.getDate() : currentday));
                        }
                      } else {
                        setSelectedDate(new Date(years[index], selectedDate ? selectedDate?.getMonth() : currentmonth, selectedDate ? selectedDate?.getDate() : currentday));
                      }
                    }
                    }
                    visibleRest={5}
                  />

                </PickerContainer>
              </View>
              <View style={{ width: '27%', marginRight: 10 }}>
                <SelectLabel >월</SelectLabel>
                <PickerContainer>
                  <WheelPicker
                    key={months}
                    selectedIndex={
                      selectedDate ? (months.indexOf(selectedDate?.getMonth() + 1) >= 0 ? months.indexOf(selectedDate?.getMonth() + 1) : 0) : (currentDate ? daysInMonth.indexOf(currentDate.getMonth() + 1) : 0)
                    }
                    containerStyle={{
                      width: 120,
                      height: 440,
                      borderRadius: 10,
                    }}
                    itemTextStyle={{
                      fontFamily: 'Pretendard-Regular',
                      fontSize: 18,
                      color: '#1B1C1F',
                    }}
                    allowFontScaling={false}
                    selectedIndicatorStyle={{
                      backgroundColor: 'transparent',
                    }}
                    itemHeight={40}
                    options={months}
                    onChange={index => {
                      setSelectedDate(new Date(selectedDate ? selectedDate.getFullYear() : currentyear, months[index] - 1, selectedDate ? selectedDate.getDate() : currentDate));

                      //setDaysInMonth(getDaysInMonth(monthIndex, selectedYear ? selectedYear : currentyear));
                      //setSelectedDate(new Date(selectedYear !== null ? selectedYear : currentyear, monthIndex, selectedDate !== null ? selectedDate.getDate() : currentDate.getDate()));
                    }}
                    visibleRest={5}
                  />

                </PickerContainer>
              </View>
              <View style={{ width: '27%', marginRight: 10 }}>
                <SelectLabel >일</SelectLabel>
                <PickerContainer>
                  <WheelPicker
                    key={daysInMonth}
                    selectedIndex={
                      selectedDate ? daysInMonth.indexOf(selectedDate.getDate()) >= 0 ? daysInMonth.indexOf(selectedDate.getDate()) : 0 : (currentDate ? daysInMonth.indexOf(currentDate.getDate()) : 0)}
                    containerStyle={{
                      width: 120,
                      height: 440,
                      borderRadius: 10,
                    }}
                    itemTextStyle={{
                      fontFamily: 'Pretendard-Regular',
                      fontSize: 18,
                      color: '#1B1C1F',
                    }}
                    allowFontScaling={false}
                    selectedIndicatorStyle={{
                      backgroundColor: 'transparent',
                    }}
                    itemHeight={40}
                    options={daysInMonth}
                    onChange={index => {
                      setSelectedDate(new Date(selectedDate ? selectedDate.getFullYear() : currentyear, selectedDate ? selectedDate?.getMonth() : currentmonth, daysInMonth[index]));
                    }}
                    visibleRest={5}
                  />
                </PickerContainer>
              </View>
            </SelectGroup>
          </View>

        </>)}
    </View>
  );
};

export default Calendar;
