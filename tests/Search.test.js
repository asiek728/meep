import { filterBySearchTerm } from '../screens/Filter'
import {data} from '../components/users'
import { expect } from '@jest/globals';

describe('Search bar tests', () => {
    test('Test if an empty search term returns the whole users list', () => {
        //Arrange
        const results = filterBySearchTerm('', data)
        //Assert
        expect(results).toBe(data)

    });

    test('Test if the list is empty if nothing is matching', () => {
        //Arrange
        const results = filterBySearchTerm('asnlkurlenafksjnerdkun', data)
        //Assert
        expect(results).toStrictEqual([])

    });

    test('Test if the search shows only persons with the interest searched for', () => {
        //Arrange
        const results = filterBySearchTerm('books', data)
        //Assert
        expect(results).toStrictEqual([
            {
                name: 'Richard Müller',
                university: 'University of Aberdeen',
                interests: ['books', 'library', 'reading sessions'],
                fieldOfStudy: 'biology',
                gender: 'male',
                id: 10,
                distance: 12
              },
        ])

    });
})