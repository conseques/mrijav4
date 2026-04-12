const { parseJson } = require('./json');

const toTimestampObject = (isoString) => {
  if (!isoString) {
    return null;
  }

  const milliseconds = Date.parse(isoString);
  if (Number.isNaN(milliseconds)) {
    return null;
  }

  return {
    seconds: Math.floor(milliseconds / 1000)
  };
};

function mapUserRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone || '',
    status: row.status,
    role: row.role,
    skills: parseJson(row.skills, []),
    createdAt: toTimestampObject(row.created_at),
    updatedAt: toTimestampObject(row.updated_at)
  };
}

function mapTaskRow(row, appliedUsers = []) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date_text,
    location: row.location,
    marker: row.marker || '',
    skillsRequired: parseJson(row.skills_required, []),
    urgency: row.urgency,
    appliedUsers,
    createdAt: toTimestampObject(row.created_at),
    updatedAt: toTimestampObject(row.updated_at)
  };
}

function mapEventRow(row) {
  return {
    id: row.id,
    imageUrl: row.image_url,
    day: row.day,
    time: row.time,
    tagType: row.tag_type,
    locales: parseJson(row.locales, {}),
    createdAt: toTimestampObject(row.created_at),
    updatedAt: toTimestampObject(row.updated_at)
  };
}

function mapPastEventRow(row) {
  return {
    id: row.id,
    imageUrl: row.image_url,
    date: row.date_text,
    tag: row.tag,
    locales: parseJson(row.locales, {}),
    createdAt: toTimestampObject(row.created_at),
    updatedAt: toTimestampObject(row.updated_at)
  };
}

function mapCourseRow(row) {
  return {
    id: row.id,
    imageUrl: row.image_url,
    teacherPhotoUrl: row.teacher_photo_url,
    phone: row.phone,
    locales: parseJson(row.locales, {}),
    createdAt: toTimestampObject(row.created_at),
    updatedAt: toTimestampObject(row.updated_at)
  };
}

module.exports = {
  mapCourseRow,
  mapEventRow,
  mapPastEventRow,
  mapTaskRow,
  mapUserRow,
  toTimestampObject
};
