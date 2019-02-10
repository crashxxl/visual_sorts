async function insertion_sort() {
  for(let i = 1; i < array.length; i++) {
    let x = await get_array_value(i);
    let j;
    for(j = i; j > 0 && await compare_values(await get_array_value(j - 1), x) > 0; j--) {
      await set_array_value(j, await get_array_value(j - 1));
    }
    await set_array_value(j, x);
  }
}


async function merge(start, mid, end) {
   let start1 = start;
   let start2 = mid + 1;
   let result = [];

   if(await compare_values(await get_array_value(mid), await get_array_value(start2)) <= 0) {
     return;
   }

   while(start1 <= mid && start2 <= end) {
     if(await compare_values(await get_array_value(start1), await get_array_value(start2)) <= 0) {
       result.push(await get_array_value(start1));
       start1++;
     } else {
       result.push(await get_array_value(start2));
       start2++;
     }
   }

   while(start1 <= mid) {
     result.push(await get_array_value(start1))
     start1++;
   }

   while(start2 <= end) {
     result.push(await get_array_value(start2))
     start2++;
   }

   for(let i = 0; i < result.length; i++) {
     await set_array_value(start, result[i])
     start++;
   }
}

 async function do_merge_sort(l, r) {
  if(l < r) {
    let m = l + Math.floor((r - l) / 2);
    await do_merge_sort(l, m);
    await do_merge_sort(m + 1, r);
    await merge(l, m, r);
  }
}

async function merge_sort() {
  await do_merge_sort(0, array.length - 1);
}


async function tamise(node, n) {
  let k = node;
  let j = 2*k;
  while(j < n) {
    if(await compare_values(await get_array_value(j), await get_array_value(j + 1)) < 0) {
      j++;
    }
    if(await compare_values(await get_array_value(k), await get_array_value(j)) < 0) {
      let tmp = await get_array_value(k);
      await set_array_value(k, await get_array_value(j));
      await set_array_value(j, tmp);
      k = j;
      j = 2*k;
    } else {
      j = n + 1;
    }
  }
}

async function do_heap_sort(n) {
  for(let i = Math.floor(n/2); i >= 0; i--) {
    await tamise(i, n);
  }
  for(let i = n - 1; i >= 1; i--) {
    let tmp = await get_array_value(i);
    await set_array_value(i, await get_array_value(0));
    await set_array_value(0, tmp);
    await tamise(0, i - 1);
  }
}

async function heap_sort() {
  await do_heap_sort(array.length);
}


async function count_sort() {
  let result = [];
  for(let i = 0; i < array.length; i++) {
    let v = await get_array_value(i);
    let count = result[v] == null ? 0 : result[v];
    result[v] = count + 1;
  }
  let i = 0;
  let j = 0;
  while(i < result.length) {
    if(result[i] != null) {
      for(let k = 0; k < result[i]; k++) {
        await set_array_value(j, i)
        j++;
      }
    }
    i++;
  }
}

/**
 * Sorts an array using radix sort.
 * @param {Array} array The array to sort.
 * @param {number} [radix=10] The base/radix to use.
 * @returns The sorted array.
 */
async function radix_sort() {
  let radix = 4;

  if (array.length === 0) {
    return;
  }

  radix = radix || 10;

  // Determine minimum and maximum values
  let minValue = await get_array_value(0);
  let maxValue = await get_array_value(0);
  for (let i = 1; i < array.length; i++) {
    let v = await get_array_value(i);
    if (await compare_values(await get_array_value(i), minValue) < 0) {
      minValue = await get_array_value(i);
    } else if (await compare_values(await get_array_value(i), maxValue) > 0) {
      maxValue =  await get_array_value(i);
    }
  }

  // Perform counting sort on each exponent/digit, starting at the least
  // significant digit
  let exponent = 1;
  while ((maxValue - minValue) / exponent >= 1) {
    await countingSortByDigit(radix, exponent, minValue);
    exponent *= radix;
  }
}

/**
 * Stable sorts an array by a particular digit using counting sort.
 * @param {Array} array The array to sort.
 * @param {number} radix The base/radix to use to sort.
 * @param {number} exponent The exponent of the significant digit to sort.
 * @param {number} minValue The minimum value within the array.
 * @returns The sorted array.
 */
async function countingSortByDigit(radix, exponent, minValue) {
  let i;
  let bucketIndex;
  let buckets = new Array(radix);
  let output = new Array(array.length);

  // Initialize bucket
  for (i = 0; i < radix; i++) {
    buckets[i] = 0;
  }

  // Count frequencies
  for (i = 0; i < array.length; i++) {
    bucketIndex = Math.floor(((await get_array_value(i) - minValue) / exponent) % radix);
    buckets[bucketIndex]++;
  }

  // Compute cumulates
  for (i = 1; i < radix; i++) {
    buckets[i] += buckets[i - 1];
  }

  let copy = array.concat();

  // Move records
  for (i = array.length - 1; i >= 0; i--) {
    let v = await get_array_value(i);
    v = copy[i];
    bucketIndex = Math.floor(((v - minValue) / exponent) % radix);
    await set_array_value(--buckets[bucketIndex], v);
  }
}
