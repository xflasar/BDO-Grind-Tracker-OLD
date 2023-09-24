import React, { useState, useEffect } from 'react'
import '../../assets/pages/Marketplace/MarketplaceMenu.scss'
const MarketplaceMenu = () => {
  const [activeMenu, setActiveMenu] = useState('')
  const [activeCategory, setActiveCategory] = useState('')

  const handleSelectCategory = (value) => {
    setActiveCategory(value)
  }

  useEffect(() => {
    console.log(activeMenu)
    console.log(activeCategory)
  }, [])
  return (
    <div className='marketplace-menu'>
      <div className={activeMenu === 'RegistrationQueue' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectCategory('RegistrationQueue')}>Registration Queue</a>
      </div>
      <div className={activeMenu === 'MainWeapon' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('MainWeapon')}>Main Weapon</a>
      {activeMenu === 'MainWeapon' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('Longsword')}>Longsword</a></div>
          <div><a onClick={() => handleSelectCategory('Longbow')}>Longbow</a></div>
          <div><a onClick={() => handleSelectCategory('Amulet')}>Amulet</a></div>
          <div><a onClick={() => handleSelectCategory('Axe')}>Axe</a></div>
          <div><a onClick={() => handleSelectCategory('Shortsword')}>Shortsword</a></div>
          <div><a onClick={() => handleSelectCategory('Blade')}>Blade</a></div>
          <div><a onClick={() => handleSelectCategory('Staff')}>Staff</a></div>
          <div><a onClick={() => handleSelectCategory('Kriegsmesser')}>Kriegsmesser</a></div>
          <div><a onClick={() => handleSelectCategory('Gauntlet')}>Gauntlet</a></div>
          <div><a onClick={() => handleSelectCategory('CrescentPendulum')}>Crescent Pendulum</a></div>
          <div><a onClick={() => handleSelectCategory('Crossbow')}>Crossbow</a></div>
          <div><a onClick={() => handleSelectCategory('Florang')}>Florang</a></div>
          <div><a onClick={() => handleSelectCategory('BattleAxe')}>Battle Axe</a></div>
          <div><a onClick={() => handleSelectCategory('Shamshir')}>Shamshir</a></div>
          <div><a onClick={() => handleSelectCategory('MorningStar')}>Morning Star</a></div>
          <div><a onClick={() => handleSelectCategory('Kyve')}>Kyve</a></div>
          <div><a onClick={() => handleSelectCategory('Serenaca')}>Serenaca</a></div>
          <div><a onClick={() => handleSelectCategory('Slayer')}>Slayer</a></div>
          <div><a onClick={() => handleSelectCategory('SwallowtailFan')}>Swallowtail Fan</a></div>
        </div>
      )}</div>
      <div className={activeMenu === 'SubWeapon' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('SubWeapon')}>Sub Weapon</a>
      {activeMenu === 'SubWeapon' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('Shield')}>Shield</a></div>
          <div><a onClick={() => handleSelectCategory('Dagger')}>Dagger</a></div>
          <div><a onClick={() => handleSelectCategory('Talisman')}>Talisman</a></div>
          <div><a onClick={() => handleSelectCategory('Ornamental Knot')}>Ornamental Knot</a></div>
          <div><a onClick={() => handleSelectCategory('Trinket')}>Trinket</a></div>
          <div><a onClick={() => handleSelectCategory('HornBow')}>Horn Bow</a></div>
          <div><a onClick={() => handleSelectCategory('Kunai')}>Kunai</a></div>
          <div><a onClick={() => handleSelectCategory('Shuriken')}>Shuriken</a></div>
          <div><a onClick={() => handleSelectCategory('Vambrace')}>Vambrace</a></div>
          <div><a onClick={() => handleSelectCategory('Noble Sword')}>Noble Sword</a></div>
          <div><a onClick={() => handleSelectCategory('raghon')}>ra&apos;ghon</a></div>
          <div><a onClick={() => handleSelectCategory('Vitclari')}>Vitclari</a></div>
          <div><a onClick={() => handleSelectCategory('Haladie')}>Haladie</a></div>
          <div><a onClick={() => handleSelectCategory('Quoratum')}>Quoratum</a></div>
          <div><a onClick={() => handleSelectCategory('Mareca')}>Mareca</a></div>
          <div><a onClick={() => handleSelectCategory('Shard')}>Shard</a></div>
          <div><a onClick={() => handleSelectCategory('DoStave')}>Do Stave</a></div>
          <div><a onClick={() => handleSelectCategory('BinyeoKnife')}>Binyeo Knife</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'AwakeningWeapon' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('AwakeningWeapon')}>Awakening Weapon</a>
      {activeMenu === 'AwakeningWeapon' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('GreatSword')}>Great Sword</a></div>
          <div><a onClick={() => handleSelectCategory('Scythe')}>Scythe</a></div>
          <div><a onClick={() => handleSelectCategory('IronBuster')}>Iron Buster</a></div>
          <div><a onClick={() => handleSelectCategory('KamasylvenSword')}>Kamasylven Sword</a></div>
          <div><a onClick={() => handleSelectCategory('CelestialBoStaff')}>Celestial Bo Staff</a></div>
          <div><a onClick={() => handleSelectCategory('Lancia')}>Lancia</a></div>
          <div><a onClick={() => handleSelectCategory('CrescentBlade')}>CrescentBlade</a></div>
          <div><a onClick={() => handleSelectCategory('Kerispear')}>Kerispear</a></div>
          <div><a onClick={() => handleSelectCategory('SuraKatana')}>Sura Katana</a></div>
          <div><a onClick={() => handleSelectCategory('SahChakram')}>Sah Chakram</a></div>
          <div><a onClick={() => handleSelectCategory('AadSphera')}>Aad Sphera</a></div>
          <div><a onClick={() => handleSelectCategory('GodrSphera')}>Godr Sphera</a></div>
          <div><a onClick={() => handleSelectCategory('Vediant')}>Vediant</a></div>
          <div><a onClick={() => handleSelectCategory('Gardbrace')}>Gardbrace</a></div>
          <div><a onClick={() => handleSelectCategory('Cestus')}>Cestus</a></div>
          <div><a onClick={() => handleSelectCategory('CrimsonGlaives')}>Crimson Glaives</a></div>
          <div><a onClick={() => handleSelectCategory('Greatbow')}>Greatbow</a></div>
          <div><a onClick={() => handleSelectCategory('Jordun')}>Jordun</a></div>
          <div><a onClick={() => handleSelectCategory('DualGlaives')}>Dual Glaives</a></div>
          <div><a onClick={() => handleSelectCategory('Sting')}>Sting</a></div>
          <div><a onClick={() => handleSelectCategory('Kibelius')}>Kibelius</a></div>
          <div><a onClick={() => handleSelectCategory('Patraca')}>Patraca</a></div>
          <div><a onClick={() => handleSelectCategory('Trion')}>Trion</a></div>
          <div><a onClick={() => handleSelectCategory('SoulTome')}>Soul Tome</a></div>
          <div><a onClick={() => handleSelectCategory('FoxtailFans')}>Foxtail Fans</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'Armor' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('Armor')}>Armor</a>
      {activeMenu === 'Armor' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('Helmet')}>Helmet</a></div>
          <div><a onClick={() => handleSelectCategory('Armor')}>Armor</a></div>
          <div><a onClick={() => handleSelectCategory('Gloves')}>Gloves</a></div>
          <div><a onClick={() => handleSelectCategory('Shoes')}>Shoes</a></div>
          <div><a onClick={() => handleSelectCategory('FunctionalClothes')}>Functional Clothes</a></div>
          <div><a onClick={() => handleSelectCategory('CraftedClothes')}>Crafted Clothes</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'Lightstone' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('Lightstone')}>Lightstone</a>
      {activeMenu === 'Lightstone' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('LightstoneOfFire')}>Lightstone Of Fire</a></div>
          <div><a onClick={() => handleSelectCategory('LightstoneOfEarth')}>Lightstone Of Earth</a></div>
          <div><a onClick={() => handleSelectCategory('LightstoneOfEarth')}>Lightstone Of Earth</a></div>
          <div><a onClick={() => handleSelectCategory('LightstoneOfEarth')}>Lightstone Of Earth</a></div>
          <div><a onClick={() => handleSelectCategory('SpecialLightstone')}>Special Lightstone</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'Accessories' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('Accessories')}>Accessories</a>
      {activeMenu === 'Accessories' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('Ring')}>Ring</a></div>
          <div><a onClick={() => handleSelectCategory('Necklace')}>Necklace</a></div>
          <div><a onClick={() => handleSelectCategory('Earring')}>Earring</a></div>
          <div><a onClick={() => handleSelectCategory('Belt')}>Belt</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'Material' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('Material')}>Material</a>
      {activeMenu === 'Material' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('OreGem')}>Ore/Gem</a></div>
          <div><a onClick={() => handleSelectCategory('Plants')}>Plants</a></div>
          <div><a onClick={() => handleSelectCategory('SeedFruit')}>Seed/Fruit</a></div>
          <div><a onClick={() => handleSelectCategory('Leather')}>Leather</a></div>
          <div><a onClick={() => handleSelectCategory('Blood')}>Blood</a></div>
          <div><a onClick={() => handleSelectCategory('Meat')}>Meat</a></div>
          <div><a onClick={() => handleSelectCategory('Seafood')}>Seafood</a></div>
          <div><a onClick={() => handleSelectCategory('Misc')}>Misc.</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'EnhancementItems' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('EnhancementItems')}>Enhancement Items</a>
      {activeMenu === 'EnhancementItems' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('BlackStone')}>Black Stone</a></div>
          <div><a onClick={() => handleSelectCategory('Upgrade')}>Upgrade</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'Consumables' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('Consumables')}>Consumables</a>
      {activeMenu === 'Consumables' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('ElixirOffensive')}>(Elixir) Offensive</a></div>
          <div><a onClick={() => handleSelectCategory('ElixirDefensive')}>(Elixir) Defensive</a></div>
          <div><a onClick={() => handleSelectCategory('ElixirFunctional')}>(Elixir) Functional</a></div>
          <div><a onClick={() => handleSelectCategory('Food')}>Food</a></div>
          <div><a onClick={() => handleSelectCategory('Potion')}>Potion</a></div>
          <div><a onClick={() => handleSelectCategory('SiegeItems')}>Siege Items</a></div>
          <div><a onClick={() => handleSelectCategory('ItemParts')}>Item Parts</a></div>
          <div><a onClick={() => handleSelectCategory('OtherConsumables')}>Other consumables</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'LifeTools' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('LifeTools')}>Life Tools</a>
      {activeMenu === 'LifeTools' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('LumberingAxe')}>Lumbering Axe</a></div>
          <div><a onClick={() => handleSelectCategory('FluidCollector')}>Fluid Collector</a></div>
          <div><a onClick={() => handleSelectCategory('ButcherKnife')}>Butcher Knife</a></div>
          <div><a onClick={() => handleSelectCategory('Pickaxe')}>Pickaxe</a></div>
          <div><a onClick={() => handleSelectCategory('Hoe')}>Hoe</a></div>
          <div><a onClick={() => handleSelectCategory('TanningKnife')}>Tanning Knife</a></div>
          <div><a onClick={() => handleSelectCategory('FishingTools')}>Fishing Tools</a></div>
          <div><a onClick={() => handleSelectCategory('Matchlock')}>Matchlock</a></div>
          <div><a onClick={() => handleSelectCategory('AlchemyCooking')}>Alchemy Cooking</a></div>
          <div><a onClick={() => handleSelectCategory('OtherTools')}>Other Tools</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'AlchemyStone' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('AlchemyStone')}>Alchemy Stone</a>
      {activeMenu === 'AlchemyStone' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('Destruction')}>Destruction</a></div>
          <div><a onClick={() => handleSelectCategory('Protection')}>Protection</a></div>
          <div><a onClick={() => handleSelectCategory('Life')}>Life</a></div>
          <div><a onClick={() => handleSelectCategory('SpiritStone')}>Spirit Stone</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'MagicCrystal' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('MagicCrystal')}>Life Tools</a>
      {activeMenu === 'MagicCrystal' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('AttackCrystal')}>Attack Crystal</a></div>
          <div><a onClick={() => handleSelectCategory('DefenseCrystal')}>Defense Crystal</a></div>
          <div><a onClick={() => handleSelectCategory('FunctionalCrystal')}>Functional Crystal</a></div>
          <div><a onClick={() => handleSelectCategory('CombinedCrystal')}>Combined Crystal</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'MountItems' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('MountItems')}>Mount Items</a>
      {activeMenu === 'MountItems' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('MountRegistration')}>Registration</a></div>
          <div><a onClick={() => handleSelectCategory('Feed')}>Feed</a></div>
          <div><a onClick={() => handleSelectCategory('Champron')}>Champron</a></div>
          <div><a onClick={() => handleSelectCategory('Barding')}>Barding</a></div>
          <div><a onClick={() => handleSelectCategory('Saddle')}>Saddle</a></div>
          <div><a onClick={() => handleSelectCategory('Stirrups')}>Stirrups</a></div>
          <div><a onClick={() => handleSelectCategory('Horseshoe')}>Horseshoe</a></div>
          <div><a onClick={() => handleSelectCategory('ElephantStirrups')}>(Elephant) Stirrups</a></div>
          <div><a onClick={() => handleSelectCategory('ElephantArmor')}>(Elephant) Armor</a></div>
          <div><a onClick={() => handleSelectCategory('ElephantMask')}>(Elephant) Mask</a></div>
          <div><a onClick={() => handleSelectCategory('ElephantSaddle')}>(Elephant) Saddle</a></div>
          <div><a onClick={() => handleSelectCategory('CourserTraining')}>Courser Training</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'ShipItems' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('ShipItems')}>Ship Items</a>
      {activeMenu === 'ShipItems' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('ShipRegistration')}>Registration</a></div>
          <div><a onClick={() => handleSelectCategory('Cargo')}>Cargo</a></div>
          <div><a onClick={() => handleSelectCategory('Prow')}>Prow</a></div>
          <div><a onClick={() => handleSelectCategory('Decoration')}>Decoration</a></div>
          <div><a onClick={() => handleSelectCategory('Totem')}>Totem</a></div>
          <div><a onClick={() => handleSelectCategory('ProwStatue')}>Prow Statue</a></div>
          <div><a onClick={() => handleSelectCategory('Plating')}>Plating</a></div>
          <div><a onClick={() => handleSelectCategory('Cannon')}>Cannon</a></div>
          <div><a onClick={() => handleSelectCategory('Sail')}>Sail</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'WagonItems' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('WagonItems')}>Wagon Items</a>
      {activeMenu === 'WagonItems' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('WagonRegistration')}>Registration</a></div>
          <div><a onClick={() => handleSelectCategory('Wheel')}>Wheel</a></div>
          <div><a onClick={() => handleSelectCategory('Cover')}>Cover</a></div>
          <div><a onClick={() => handleSelectCategory('Flag')}>Flag</a></div>
          <div><a onClick={() => handleSelectCategory('Emblem')}>Emblem</a></div>
          <div><a onClick={() => handleSelectCategory('Lamp')}>Lamp</a></div>
        </div>
      )}
      </div>
      <div className={activeMenu === 'FurnitureItems' ? 'category active-menu-category' : 'category'}><a onClick={() => setActiveMenu('FurnitureItems')}>Furniture Items</a>
      {activeMenu === 'FurnitureItems' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectCategory('Bed')}>Bed</a></div>
          <div><a onClick={() => handleSelectCategory('BedsideTable')}>Bedside Table/Table</a></div>
          <div><a onClick={() => handleSelectCategory('WardrobeBookshelf')}>Wardrobe Bookshelf/Bookshelf</a></div>
          <div><a onClick={() => handleSelectCategory('SofaChair')}>Sofa/Chair</a></div>
          <div><a onClick={() => handleSelectCategory('Chandelier')}>Chandelier</a></div>
          <div><a onClick={() => handleSelectCategory('FloorCarpet')}>Floor/Carpet</a></div>
          <div><a onClick={() => handleSelectCategory('WallCurtain')}>Wall/Curtain</a></div>
          <div><a onClick={() => handleSelectCategory('Decoration')}>Decoration</a></div>
          <div><a onClick={() => handleSelectCategory('Others')}>Others</a></div>
        </div>
      )}
      </div>
    </div>
  )
}

export default MarketplaceMenu
