#!/usr/bin/node

class HashMap {
  constructor() {
    this.table = [];
    this.capacity = 16;
    this.loadFactor = 0.75;
    this.entryCount = 0;
  }


  resize() {
    console.log("RESIZING")
    const oldTable = [...this.table];
    this.clear();
    this.capacity *= 2;
    for (let i = 0; i < oldTable.length; i++) {
      if (oldTable[i]) {
        let currentNode = oldTable[i].head;
        while (currentNode) {
          this.set(currentNode.key, currentNode.value)
          currentNode = currentNode.nextNode;
        }
      }
    }
  }

  hash(key) {
    let hashCode = 0;
       
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }
    if (hashCode < 0 || hashCode >= this.capacity) {
      console.log(hashCode)
      throw new Error("Trying to access index out of bounds");
    }
    return hashCode;
  } 

  set(key, value) {
    const hashCode = this.hash(key) % this.capacity;
    const bucket = this.table[hashCode];
    if (!bucket) {
      const newBucket = new LinkedList();
      newBucket.append(key, value)
      this.table[hashCode] = newBucket;
      this.entryCount++;
    }
    else {
      let currentNode = bucket.head;
      while (currentNode) {
        if (currentNode.key === key) {
          currentNode.value = value;
          return;
        }
        currentNode = currentNode.nextNode;
      }
        bucket.append(key, value);
        this.entryCount++;
    }
    if (this.entryCount > this.capacity*this.loadFactor) { this.resize() }
  }

  get(key) {
    const hashCode = this.hash(key);
    const bucket = this.table[hashCode];
    if (!bucket) {
      return null;
    }
    const node = bucket.find(key);
    if(!node) { return null }
    return node.value;
  }

  has(key) { 
    const hashCode = this.hash(key);
    const bucket = this.table[hashCode];
    if (!bucket) {
      return false;
    }
    if (bucket.find(key)) {return true}
    return false;
  }

  remove(key) {
    const hashCode = this.hash(key);
    const bucket = this.table[hashCode];
    if (!bucket) {
      return false;
    }
    const node = bucket.find(key);
    if (bucket.remove(node)) {
      this.entryCount--;
      return true;
    }
    return false;
  }

  length(){
    return this.entryCount;
  }

  clear(){
    this.table = [];
    this.entryCount = 0;
  }

  keys(){
    const keys = [];
    for (let i = 0; i < this.capacity; i++) {
      if (this.table[i]) {
        keys.push(...this.table[i].getKeys())
      }
    }
    return keys;
  }

  values(){
    const values = [];
    for (let i = 0; i < this.capacity; i++) {
      if (this.table[i]) {
        values.push(...this.table[i].getValues())
      }
    }
    return values;
  }

  entries(){
    const entries = [];
    for (let i = 0; i < this.capacity; i++) {
      if (this.table[i]) {
        entries.push(...this.table[i].getEntries())
      }
    }
    return entries;
  }
}



class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(key, value){
    const newNode = new Node(key, value);
    if (this.tail) {
      this.tail.nextNode = newNode;
      this.tail = newNode;
    }
    else {
      this.head = newNode;
      this.tail = newNode;
    }
    this.size++;
    return;
  }

  find(key) {
    if (!this.head) { return null}
    let currentNode = this.head;
    while (currentNode) {
      if (currentNode.key === key) {
        return currentNode;
      }
      currentNode = currentNode.nextNode;
    }
    return null;
  }

  remove(node){
    if (!node) {return false}
    if (node === this.head) {
      this.head = node.nextNode;
      if (node === this.tail) {
        this.tail = this.head;
      }
      return true;
    }
    let currentNode = this.head;
    while (currentNode) {
      if (currentNode.nextNode === node) {
        currentNode.nextNode = node.nextNode;
        if (node === this.tail) {
          this.tail = currentNode;
        }
        return true;
      }
      currentNode = currentNode.nextNode;
    }
    return false;
  }

  getKeys(){
    const keys = [];
    if (!this.head) {
      return [];
    }
    let currentNode = this.head;
    while (currentNode) {
      keys.push(currentNode.key)
      currentNode = currentNode.nextNode;
    }
    return keys;
  }

  getValues(){
    const values = [];
    if (!this.head) {
      return [];
    }
    let currentNode = this.head;
    while (currentNode) {
      values.push(currentNode.value)
      currentNode = currentNode.nextNode;
    }
    return values;
  }

  getEntries(){
    const entries = [];
    if (!this.head) {
      return [];
    }
    let currentNode = this.head;
    while (currentNode) {
      entries.push([`${currentNode.key}, ${currentNode.value}`])
      currentNode = currentNode.nextNode;
    }
    return entries;
  }
}

class Node{
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

// ----------- TESTING ----------

// const test = new HashMap() 

// test.set('apple', 'red')
// test.set('banana', 'yellow')
// test.set('carrot', 'orange')
// test.set('dog', 'brown')
// test.set('elephant', 'gray')
// test.set('frog', 'green')
// test.set('grape', 'purple')
// test.set('hat', 'black')
// test.set('ice cream', 'white')
// test.set('jacket', 'blue')
// test.set('kite', 'pink')
// test.set('lion', 'golden')
// console.log(test.entries())

// test.set("stolen", "person")
// console.log(test.entries())

// // test.set("mouse", "black")
// // test.set("key", "white")
// // console.log(test.get("frog"))
// // console.log(test.entries())
// console.log(test.length())
