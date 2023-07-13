// Helper file to filter the profiles by Term, Study, Gender and Distance
export const filterBySearchTerm = (currentSearchTerm, users) => {
  if (currentSearchTerm != '') {
    return users.filter((user) => {
      return user.interests.some((interest) => {
        return interest.toLowerCase().includes(currentSearchTerm.toLowerCase())
      })
    })
  } else return users
}

export const filterByFieldOfStudy = (currentFieldOfStudy, users) => {
  if (currentFieldOfStudy.length !== 0) {

    if (currentFieldOfStudy[0] == 'all') return users

    return users.filter((user) => {
      return user.fieldOfStudy == currentFieldOfStudy[0]
    })
  } else return users
}

export const filterByGender = (currentGender, users) => {
  if (currentGender.length !== 0) {

    if (currentGender[0] == 'all') return users

    return users.filter((user) => {
      return user.gender == currentGender[0]
    })
  } else return users
}

export const filterByDistance = (currentDistance, users) => {
  if (currentDistance != -1) {
    return users.filter((user) => {
      return user.localisation <= currentDistance
    })
  } else return users
}