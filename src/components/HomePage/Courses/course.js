import digitalverden from '../../../images/сourses/digitalverden.jpg';
import Yoga from '../../../images/сourses/YogaKurs.jpg'
import norskkurs from '../../../images/сourses/norskkurs.jpg'
import norskkursB1 from '../../../images/сourses/norskkursB1.jpg'

import Vladimir from '../../../images/leadership/Vladimir.jpg';
import Valentina from '../../../images/leadership/Valentina.jpg';
import Sviatoslav from '../../../images/leadership/Sviatoslav.jpg';
import YogaTeacher from '../../../images/leadership/YogaTeacher.jpg';

const course = [
    {
        image: norskkurs,
        levels: 'norskKursA1.levels',
        duration: 'norskKursA1.duration',
        name: 'norskKursA1.name',
        description: 'norskKursA1.description',
        teacherPhoto: Vladimir,
        teacherNameKey: 'norskKursA1.teacherName',
        teacherInfoKey: 'norskKursA1.teacherInfo',
        phone: 'TBA',
        locationKey: 'drammenLibrary'
    },
    {
        image: norskkursB1,
        levels: 'norskKursB1.levels',
        duration: 'norskKursB1.duration',
        name: 'norskKursB1.name',
        description: 'norskKursB1.description',
        teacherPhoto: Valentina,
        teacherNameKey: 'norskKursB1.teacherName',
        teacherInfoKey: 'norskKursB1.teacherInfo',
        phone: '468 207 24',
        locationKey: 'locationDrammenLibB1'
    },
    {
        image: digitalverden,
        levels: 'digitalVerden.levels',
        duration: 'digitalVerden.duration',
        name: 'digitalVerden.name',
        description: 'digitalVerden.description',
        teacherPhoto: Sviatoslav,
        teacherNameKey: 'digitalVerden.teacherName',
        teacherInfoKey: 'digitalVerden.teacherInfo',
        phone: '912 548 07',
        locationKey: 'drammenLibrary'
    },
    {
        image: Yoga,
        levels: 'yogaCourse.levels',
        duration: 'yogaCourse.duration',
        name: 'yogaCourse.name',
        description: 'yogaCourse.description',
        teacherPhoto: YogaTeacher,
        teacherNameKey: 'yogaCourse.teacherName',
        teacherInfoKey: 'yogaCourse.teacherInfo',
        phone: '972 833 24',
        locationKey: 'drammenLibrary'
    }
]

export default course;