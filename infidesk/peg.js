class Match {
  constructor(text, start, end, children = []) {
    this.text = text;
    this.start = start;
    this.end = end;
    this.children = children;
  }
}

const literal = (pattern) => (text, i) => {
  if (text.startsWith(pattern, i))
    return new Match(text, i, i + pattern.length)
}

const chain = (...patterns) => (text, i) => {
  let children = [], start = i;
  for (let pattern of patterns) {
    let result = pattern(text, i);
    if (!result) return;
    children.push(result);
    i = result.end;
  }
  return new Match(text, start, i, children);
}

const oneof = (...patterns) => (text, i) => {
  for (let pattern of patterns) {
    let result = pattern(text, i);
    if (result) return result;
  }
}

const repeat = (pattern) => {
  let zero_or_more = oneof(
    chain(pattern, (text, i) => zero_or_more(text, i)),
    literal(""));
  return zero_or_more
}

const not = (pattern) => (text, i) => {
  if (!pattern(text, i))
    return new Match(text, i, i);
}

const anychar = () => (text, i) => {
  if (i < text.length)
    return new Match(text, i, i + 1);
}

const capture = (pattern) => (text, i) => {
  let result = pattern(text, i);
  if (result) {
    let match = new Match(
      text, result.start, result.end, [result]);
    match.captured = text.substring(i, result.end);
    return match;
  }
}

const named = (name, pattern) => (text, i) => {
  let result = pattern(text, i);
  if (result) {
    let match = new Match(text, i, result.end, [result]);
    match.name = name;
    return match;
  }
}

class Grammar {
  ref(name) {
    return (text, i) => this[name](text, i);
  }
}

// Equivalent to not(not(pattern))
const ahead = (pattern) => (text, i) =>
  (pattern(text, i) && new Match(text, i, i))

// Equivalent to oneof(pattern, literal(""))
const maybe = (pattern) => (text, i) =>
  (pattern(text, i) || new Match(text, i, i))

// Equivalent to oneof(literal(min), ..., literal(max))
const between = (min, max) => (text, i) => {
  if (i < text.length && min <= text[i] && text[i] <= max)
    return new Match(text, i, i + 1);
}

// Equivalent to oneof(literal(allowed[0], allowed[1], ...))
// or chain(not(oneof(...)), anychar()) when inclusive=false
const charfrom = (allowed, inclusive = true) => {
  if (!inclusive)
    return chain(not(charfrom(allowed)), anychar());
  return oneof(...allowed);
}

const cached = (fn) => {
  let cache = {}, cache_text = "";
  return (text, i) => {
    if (text != cache_text) // cache is per-input-text
      cache = {}, cache_text = text;
    if (!(i in cache))
      cache[i] = fn(text, i);
    return cache[i];
  }
}

