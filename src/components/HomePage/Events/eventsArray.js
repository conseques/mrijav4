import FirstImage from '../../../images/events/1image.jpg'
import SecondImage from '../../../images/events/2image.jpg'
import ThirdImage from '../../../images/events/3image.jpg'
import KaraokeImage from '../../../images/events/karaoke.jpg'
import PoetryImage from '../../../images/gallery/poezikveld1.jpg'

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
        image: KaraokeImage,
        nameKey: 'karaokeEvent.name',
        dayKey: 'karaokeEvent.day',
        timeKey: '19:00 - 22:00',
        descriptionKey: 'karaokeEvent.description',
    },
    {
        image: PoetryImage,
        nameKey: 'poetryEvent.name',
        dayKey: 'poetryEvent.day',
        timeKey: '18:30 - 21:30',
        descriptionKey: 'poetryEvent.description',
    },
    {
        image: ThirdImage,
        nameKey: 'teachersForumEvent.name',
        dayKey: 'teachersForumEvent.day',
        timeKey: '09:00 - 16:00',
        descriptionKey: 'teachersForumEvent.description',
    }
]

export default eventsArray;