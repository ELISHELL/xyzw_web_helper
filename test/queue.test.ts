
import { it } from 'vitest';
import PQueue from 'p-queue';
import moment from 'moment';
import { useInterval, useIntervalFn } from '@vueuse/core';
import { ref } from 'vue';

it('test rate limit queue', async () => {
  const queue = new PQueue({ intervalCap: 1, interval: 200 });
  // Simulate an async task
  const someTask = () => {
    console.log('Task executed at:', moment().format('HH:mm:ss SSS'));
    return new Promise((resolve) => setTimeout(resolve, 250));
  }
  // Add many tasks
  for (let index = 0; index < 10; index++) {
    await queue.add(() => someTask());
  }
  // await queue.onRateLimit();
  console.log('All tasks have been processed.');
}, 15000);


it('test concurrency queue', async () => {
  const queue = new PQueue({ concurrency: 1, interval: 100 });

  const t = ref(10);

  setTimeout(() => {
    console.log('T100_Task join:', t.value, moment().format('HH:mm:ss SSS'));
  }, 100);


  {
    const t200 = setInterval(() => {
      if (t.value-- < 0) {
        t200.close();
      };
      let tv = t.value;
      let joinTime = moment().format('HH:mm:ss SSS');
      queue.add(async () => {
        console.log('T200_Task join:', tv, joinTime);
        console.log('T200_Task start:', tv, moment().format('HH:mm:ss SSS'));
      });
    }, 200)
  }

  {
    const t321 = setInterval(() => {
      if (t.value-- < 0) {
        t321.close();
      };
      let tv = t.value;
      let joinTime = moment().format('HH:mm:ss SSS');
      queue.add(async () => {
        console.log('T200_Task join:', tv, joinTime);
        console.log('T321_ask start:', tv, moment().format('HH:mm:ss SSS'));
      });
    }, 321)
  }
  // await queue.onRateLimit();
  await new Promise(resolve => setTimeout(resolve, 14000))
  // await queue.onIdle();
  console.log('All tasks have been processed.');
}, 15000)