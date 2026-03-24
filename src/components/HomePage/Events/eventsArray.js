import FirstImage from '../../../images/events/easter_new.jpg'
import SecondImage from '../../../images/events/ivan_kupala_new.jpg'
import ThirdImage from '../../../images/events/teachers_forum_new.jpg'
import KaraokeImage from '../../../images/events/karaoke.jpg'
import PoetryImage from '../../../images/gallery/poezikveld1.jpg'

const eventsArray = [
    {
        image: FirstImage,
        nameKey: 'easterEvent.name',
        dayKey: 'easterEvent.day',
        timeKey: '12:00 - 15:00',
        descriptionKey: 'easterEvent.description',
        tagKey: 'tags.annual',
        tagType: 'annual',
        reversed: false,
    },
    {
        image: SecondImage,
        nameKey: 'ivanKupalaEvent.name',
        dayKey: 'ivanKupalaEvent.day',
        timeKey: '18:00 - 23:00',
        descriptionKey: 'ivanKupalaEvent.description',
        tagKey: 'tags.annual',
        tagType: 'annual',
        reversed: true,
    },
    {
        image: KaraokeImage,
        nameKey: 'karaokeEvent.name',
        dayKey: 'karaokeEvent.day',
        timeKey: '19:00 - 22:00',
        descriptionKey: 'karaokeEvent.description',
        tagKey: 'tags.regular',
        tagType: 'regular',
        reversed: false,
    },
    {
        image: PoetryImage,
        nameKey: 'poetryEvent.name',
        dayKey: 'poetryEvent.day',
        timeKey: '18:30 - 21:30',
        descriptionKey: 'poetryEvent.description',
        tagKey: 'tags.regular',
        tagType: 'regular',
        reversed: true,
    },
    {
        image: PoetryImage,
        nameKey: 'retroRoomEvent.name',
        dayKey: 'retroRoomEvent.day',
        timeKey: '19:00 - 22:00',
        descriptionKey: 'retroRoomEvent.description',
        tagKey: 'tags.regular',
        tagType: 'regular',
        reversed: false,
    },
    {
        image: ThirdImage,
        nameKey: 'teachersForumEvent.name',
        dayKey: 'teachersForumEvent.day',
        timeKey: '09:00 - 16:00',
        descriptionKey: 'teachersForumEvent.description',
        tagKey: 'tags.regular',
        tagType: 'regular',
        reversed: true,
    }
]

export default eventsArray;