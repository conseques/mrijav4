import FirstImage from '../../../images/events/1image.jpg'
import SecondImage from '../../../images/events/2image.jpg'
import ThirdImage from '../../../images/events/3image.jpg'

const eventsArray = [
    {
        image: FirstImage,
        nameKey: 'easterEvent.name',
        dayKey: 'easterEvent.day',
        timeKey: '12:00 - 15:00',
        descriptionKey: 'easterEvent.description',
    },
    {
        image: SecondImage,
        nameKey: 'ivanKupalaEvent.name',
        dayKey: 'ivanKupalaEvent.day',
        timeKey: '18:00 - 23:00',
        descriptionKey: 'ivanKupalaEvent.description',
    },
    {
        image: ThirdImage,
        nameKey: 'annualReportEvent.name',
        dayKey: 'annualReportEvent.day',
        timeKey: '10:00 - 13:00',
        descriptionKey: 'annualReportEvent.description',
    }
]

export default eventsArray;