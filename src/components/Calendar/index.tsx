import { useMemo, useState } from "react";
import { CaretLeft, CaretRight } from "phosphor-react";
import { CalendarActions, CalendarBody, CalendarContainer, CalendarDay, CalendarHeader, CalendarTitle } from "./styles";
import { getWeekDays } from "@/ultils/get-week-days";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";


interface CalendarWeek {
  week: number;
  days: Array<{
    data: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

interface CalendarProps {
  selectedDate?: Date | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const router = useRouter()
  const shortWeekDays = getWeekDays({ short: true })

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const username = String(router.query.username)
  console.log(dayjs(currentDate).format('M'))
  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: ['availability', currentDate.get('year'), currentDate.get('month')],
    queryFn:  async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: String(currentDate.get('month') + 1).padStart(2, '0')
        }
      })

      return response.data
    }
  })

  const calendarWeeks = useMemo(() => {
    if(!blockedDates) {
      return []
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    const firstWeekDay = currentDate.get('day')
    const previousMonthFillArray = Array.from({
      length: firstWeekDay
    }).map((_, i) => {
      return currentDate.subtract(i + 1, 'day')
    }).reverse()

    const lasDayInCurrentMonth = currentDate.set('date', currentDate.daysInMonth())
    const lastWeekDay = lasDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1)
    }).map((_, i) => {
      return lasDayInCurrentMonth.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map(data => {
        return { data, disabled: true }
      }),
      ...daysInMonthArray.map(data => {
        return { 
          data, 
          disabled: data.endOf('day').isBefore(new Date()) || 
            blockedDates?.blockedWeekDays.includes(data.get('day')) ||
            blockedDates?.blockedDates.includes(data.get('date'))
        }
      }),
      ...nextMonthFillArray.map(data => {
        return { data, disabled: true }
      })
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if(isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7)
          })
        }
        return weeks
      }, 
      []
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  console.log(blockedDates?.blockedDates, 'BLOCK')

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month')
    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const previousMonthDate = currentDate.add(1, 'month')
    setCurrentDate(previousMonthDate)
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>
        <CalendarActions>
          <button title="Previous month" onClick={handlePreviousMonth}>
            <CaretLeft  />
          </button>
          <button title="Next month" onClick={handleNextMonth}>
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map(weekDay => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ data, disabled }) => (
                <td key={data.toString()}>
                  <CalendarDay onClick={() => onDateSelected(data.toDate())} disabled={disabled}>
                    {data.get('date')}
                  </CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}