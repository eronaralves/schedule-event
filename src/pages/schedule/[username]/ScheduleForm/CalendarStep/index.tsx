import { useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { api } from "@/lib/axios";

// Components
import { Calendar } from "@/components/Calendar";

// Styles
import { Container, TimePicker, TimePickerHeader, TimePickerItem, TimePickerList } from "./styles";
import { useQuery } from "@tanstack/react-query";

interface Avaliability {
  possibleTimes: number[],
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()
  const username = String(router.query.username)

  const isDateSelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null

  const selectedDateWithoutTime = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null
  
  const { data: availability } = useQuery<Avaliability>({
    queryKey: ['availability', selectedDateWithoutTime],
    queryFn:  async () => {
      const response = await api.get(`/users/${username}/avaliability`, {
        params: {
          date: selectedDateWithoutTime
        }
      })

      return response.data
    },
    enabled: !!selectedDate
  })

  function handleSelectTime(hour: number) {
    const dateTime = dayjs(selectedDate).set('hour', hour).startOf('hour').toDate()
  
    onSelectDateTime(dateTime)
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>
          <TimePickerList>
            {availability?.possibleTimes.map(hour => (
              <TimePickerItem onClick={() => handleSelectTime(hour)} key={hour} disabled={!availability.availableTimes.includes(hour)}>{String(hour).padStart(2, '0')}:00h</TimePickerItem>
            ))}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}