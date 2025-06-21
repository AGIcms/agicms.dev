const words = ['bannik', 'venik', 'parilshik']

/**
 * Генерирует случайное имя пользователя, используя словарь слов и случайное число
 * @returns Строка вида "слово-число"
 */
export function generateUsername(
  separator = '-',
  min = 0,
  max = 10000,
  defaultPrefix = '',
): string {
  // Если нет словаря, используем префолт
  if (!words.length && defaultPrefix) {
    return `${defaultPrefix}-${getRandomNumber(min, max)}`
  }

  // Выбираем случайное слово из массива
  const randomIndex = Math.floor(Math.random() * words.length)
  const randomWord = words[randomIndex]

  // Генерируем случайное число от min до max
  const randomNumber = getRandomNumber(min, max)

  // Возвращаем комбинацию слова и числа с разделителем
  return `${randomWord}${separator}${randomNumber}`
}

/**
 * Генерирует случайное число в заданном диапазоне
 * @param min Минимальное значение (включительно)
 * @param max Максимальное значение (включительно)
 * @returns Случайное число
 */
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
