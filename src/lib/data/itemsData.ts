import armorImage from '$lib/assets/images/armor.jpg';
import diceImage from '$lib/assets/images/dice.jpg';
import megaphoneImage from '$lib/assets/images/megaphone.jpg';
import awpImage from '$lib/assets/images/awp.jpg';
import taserImage from '$lib/assets/images/taser.jpg';
import goodBombImage from '$lib/assets/images/goodbomb.jpg';
import handgunImage from '$lib/assets/images/handgun.jpg';
import grenadeImage from '$lib/assets/images/grenade.jpg';
import magnetImage from '$lib/assets/images/magnet.jpg';
import luckyCharmImage from '$lib/assets/images/luckyCharm.jpg';
import magicScrollImage from '$lib/assets/images/magicScroll.jpg';
import blackholeImage from '$lib/assets/images/blackhole.jpg';
import shotgunImage from '$lib/assets/images/shotgun.jpg';
import placeholderImage from '$lib/assets/images/placeholder.png';

export interface IItem {
  name: string;
  image: string;
  description: string;
  effect: string;
  hint: string;
  rarity: number;
}

const ITEMS: IItem[] = [
  {
    name: 'Броня',
    image: armorImage,
    description: 'Прочный защитный доспех, который оберегает от вражеских атак и кражи ключей',
    effect: 'Защищает от кражи ключей и атак на 1 ход',
    hint: 'Наденьте броню, когда ожидаете атаку от соперников',
    rarity: 0,
  },
  {
    name: 'Амулет Удачи',
    image: luckyCharmImage,
    description: 'Магический амулет, приносящий удачу и увеличивающий количество получаемых ключей',
    effect: 'Удваивает количество полученных ключей за следующий ход',
    hint: 'Используйте амулет перед посещением клеток с ключами или сундуками',
    rarity: 3,
  },
  {
    name: 'Неуязвимость',
    image: placeholderImage,
    description: 'Сфера магической энергии, которая делает вас неуязвимым к любым атакам и негативным эффектам',
    effect: 'Полная защита от всех атак и негативных эффектов на 2 хода',
    hint: 'Активируйте неуязвимость в критические моменты',
    rarity: 3,
  },
  {
    name: 'Откат',
    image: magicScrollImage,
    description: 'Магический свиток, который возвращает игроку количество ключей, которое у него было в прошлом ходу Нельзя использовать сразу после открытия ящика',
    effect: 'Возвращает количество ключей, которое у игрока было на предыдущем ходу',
    hint: 'Применяйте откат, когда потеряли значительное количество ключей',
    rarity: 2,
  },
  {
    name: 'Мегафон',
    image: megaphoneImage,
    description: 'Устройство, которое заставляет всех игроков отдать вам часть своих ключей',
    effect: 'Заставляет всех игроков отдать по 2 ключа владельцу',
    hint: 'Используйте мегафон, чтобы быстро увеличить свои запасы ключей',
    rarity: 2,
  },
  {
    name: 'Кубик',
    image: diceImage,
    description: 'Волшебный кубик, который дарует игроку дополнительный ход',
    effect: 'Позволяет игроку сходить еще раз',
    hint: 'Используйте кубик, когда хотите получить дополнительный шанс на движение по карте',
    rarity: 2,
  },
  {
    name: 'АВП',
    image: awpImage,
    description: 'Мощная снайперская винтовка, которая позволяет атаковать соперников издалека',
    effect: 'Крадет 5 ключей у любого игрока на расстоянии до 15 клеток',
    hint: 'Используйте АВП, чтобы ослабить противников, находящихся далеко',
    rarity: 3,
  },
  {
    name: 'Дробовик',
    image: shotgunImage,
    description: 'Мощное оружие ближнего боя, которое наносит значительный урон ближайшему сопернику',
    effect: 'Крадет 5 ключей у ближайшего игрока на расстоянии до 5 клеток',
    hint: 'Примените дробовик, когда соперник находится в непосредственной близости',
    rarity: 0,
  },
  {
    name: 'Пистолет',
    image: handgunImage,
    description: 'Компактное и точное оружие, предназначенное для целенаправленных атак на соперников',
    effect: 'Крадет 5 ключей у любого игрока на расстоянии до 5 клеток',
    hint: 'Пистолет идеален для атак на сильных соперников',
    rarity: 0,
  },
  {
    name: 'Шокер',
    image: taserImage,
    description: 'Электрическое оружие, которое парализует соперников и отнимает у них ключи',
    effect: 'Отнимает 3 ключа и парализует игрока на один ход',
    hint: 'Используйте шокер, чтобы временно вывести из строя опасного соперника',
    rarity: 0,
  },
  {
    name: 'Граната',
    image: grenadeImage,
    description: 'Взрывное устройство, которое наносит урон ближайшим соперникам',
    effect: 'Отнимает 5 ключей у ближайшего игрока на расстоянии до 10 клеток',
    hint: 'Кидайте гранату, чтобы быстро уменьшить запасы ключей у ближайшего соперника',
    rarity: 1,
  },
  {
    name: 'Магнит',
    image: magnetImage,
    description: 'Устройство, которое притягивает ключи от соперников',
    effect: 'Крадет 5 ключей у выбранного игрока',
    hint: 'Применяйте магнит, чтобы украсть ключи у соперника, находящегося на выгодной позиции',
    rarity: 1,
  },
  {
    name: 'Растяжка',
    image: placeholderImage,
    description: 'Скрытая ловушка, которая наносит урон и крадет ключи у тех, кто на нее наступит',
    effect: 'Отнимает 5 ключей у следующего игрока, наступившего на клетку',
    hint: 'Установите растяжку на популярной клетке',
    rarity: 1,
  },
  {
    name: 'Черная Дыра',
    image: blackholeImage,
    description: 'Также как и растяжка, устанавливается игроком на клетке как ловушка',
    effect: 'Перемещает игрока на стартовую клетку и отнимает 10 ключей',
    hint: 'Используйте черную дыру, чтобы сбросить прогресс соперников',
    rarity: 2,
  },
  {
    name: 'Портал Обмена',
    image: placeholderImage,
    description: 'Магический портал, который позволяет обмениваться местами с другим игроком на карте',
    effect: 'Меняет местами двух игроков на карте',
    hint: 'Применяйте портал обмена, когда хотите изменить позицию на карте',
    rarity: 3,
  },
  {
    name: 'Ядерная Бомба',
    image: placeholderImage,
    description: 'Мощное взрывное устройство, наносящее колоссальный урон всем игрокам',
    effect: 'Отнимает 20 ключей у всех игроков',
    hint: 'Используйте ядерную бомбу, чтобы значительно ослабить всех соперников',
    rarity: 3,
  },
  {
    name: 'Ледяная Буря',
    image: placeholderImage,
    description: 'Магическое заклинание, вызывающее ледяной шторм, который замораживает и отнимает ключи у всех игроков',
    effect: 'Замораживает всех игроков на один ход и отнимает по 5 ключей',
    hint: 'Применяйте ледяную бурю, чтобы временно вывести из строя всех соперников',
    rarity: 3,
  },
  {
    name: 'ДоброБомба',
    image: goodBombImage,
    description: 'Уникальное устройство, распространяющее благодать и счастье. В отличие от обычного оружия массового поражения, ДоброБомба дарит ключи всем игрокам на карте',
    effect: 'Дает всем игрокам по 10 ключей',
    hint: 'Используйте ДоброБомбу, чтобы улучшить отношения с соперниками и сделать игру более интересной',
    rarity: 3,
  },
]

export default ITEMS;