import Mock from 'mockjs';

export default {
  mobile(): string {
    return Mock.mock(/^1(9|3|4|5|7|8)[0-9]{9}$/);
  },
  lon(): number {
    return Mock.Random.float(121.140308, 121.82558, 7, 8);
  },
  lat(): number {
    return Mock.Random.float(30.853426, 31.363719, 7, 7);
  },
};
