import faker from 'faker';
import _ from 'lodash';

export const data = _.times(5, () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  address: {
    street: faker.address.streetName(),
    city: faker.address.city(),
  },
}));
