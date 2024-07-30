export interface IRarity {
  name: string;
  color: string;
  value: number;
}

const RARITIES: IRarity[] = [
  { name: 'Зеленый', color: '#45CB85', value: 0 },
  { name: 'Синий', color: '#35A7FF', value: 1 },
  { name: 'Фиолетовый', color: '#CA3CFF', value: 2 }, // alt. color #FF0F80
  { name: 'Золотой', color: '#F6AE2D', value: 3 }
]

export default RARITIES;