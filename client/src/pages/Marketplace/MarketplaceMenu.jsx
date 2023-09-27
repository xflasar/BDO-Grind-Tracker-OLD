import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import '../../assets/pages/Marketplace/MarketplaceMenu.scss'

// TODO:
// Registration queue function
// Items images store locally
// Fix empty categories
// reformat whole menu
const MarketplaceMenu = ({ handleSearch }) => {
  const [activeMainCategory, setMainActiveCategory] = useState('')
  const [activeSubCategory, setSubActiveCategory] = useState('')

  const handleSelectSubCategory = (value) => {
    setSubActiveCategory(value)
    handleSearch(activeMainCategory, value)
  }

  const handleSelectMainCategory = (value) => {
    setMainActiveCategory(value)
  }

  useEffect(() => {
    console.log(activeMainCategory)
    console.log(activeSubCategory)
  }, [])

  return (
    <div className='marketplace-menu'>
      <div className={activeMainCategory === 'RegistrationQueue' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectSubCategory('RegistrationQueue')}>Registration Queue</a>
      </div>
      <div className={activeMainCategory === 'Main Weapon' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Main Weapon')}>Main Weapon</a>
      {activeMainCategory === 'Main Weapon' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Longsword')}>Longsword</a></div>
          <div><a onClick={() => handleSelectSubCategory('Longbow')}>Longbow</a></div>
          <div><a onClick={() => handleSelectSubCategory('Amulet')}>Amulet</a></div>
          <div><a onClick={() => handleSelectSubCategory('Axe')}>Axe</a></div>
          <div><a onClick={() => handleSelectSubCategory('Shortsword')}>Shortsword</a></div>
          <div><a onClick={() => handleSelectSubCategory('Blade')}>Blade</a></div>
          <div><a onClick={() => handleSelectSubCategory('Staff')}>Staff</a></div>
          <div><a onClick={() => handleSelectSubCategory('Kriegsmesser')}>Kriegsmesser</a></div>
          <div><a onClick={() => handleSelectSubCategory('Gauntlet')}>Gauntlet</a></div>
          <div><a onClick={() => handleSelectSubCategory('Crescent Pendulum')}>Crescent Pendulum</a></div>
          <div><a onClick={() => handleSelectSubCategory('Crossbow')}>Crossbow</a></div>
          <div><a onClick={() => handleSelectSubCategory('Florang')}>Florang</a></div>
          <div><a onClick={() => handleSelectSubCategory('Battle Axe')}>Battle Axe</a></div>
          <div><a onClick={() => handleSelectSubCategory('Shamshir')}>Shamshir</a></div>
          <div><a onClick={() => handleSelectSubCategory('Morning Star')}>Morning Star</a></div>
          <div><a onClick={() => handleSelectSubCategory('Kyve')}>Kyve</a></div>
          <div><a onClick={() => handleSelectSubCategory('Serenaca')}>Serenaca</a></div>
          <div><a onClick={() => handleSelectSubCategory('Slayer')}>Slayer</a></div>
          <div><a onClick={() => handleSelectSubCategory('Swallowtail Fan')}>Swallowtail Fan</a></div>
        </div>
      )}</div>
      <div className={activeMainCategory === 'Sub Weapon' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Sub Weapon')}>Sub Weapon</a>
      {activeMainCategory === 'Sub Weapon' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Shield')}>Shield</a></div>
          <div><a onClick={() => handleSelectSubCategory('Dagger')}>Dagger</a></div>
          <div><a onClick={() => handleSelectSubCategory('Talisman')}>Talisman</a></div>
          <div><a onClick={() => handleSelectSubCategory('Ornamental Knot')}>Ornamental Knot</a></div>
          <div><a onClick={() => handleSelectSubCategory('Trinket')}>Trinket</a></div>
          <div><a onClick={() => handleSelectSubCategory('Horn Bow')}>Horn Bow</a></div>
          <div><a onClick={() => handleSelectSubCategory('Kunai')}>Kunai</a></div>
          <div><a onClick={() => handleSelectSubCategory('Shuriken')}>Shuriken</a></div>
          <div><a onClick={() => handleSelectSubCategory('Vambrace')}>Vambrace</a></div>
          <div><a onClick={() => handleSelectSubCategory('Noble Sword')}>Noble Sword</a></div>
          <div><a onClick={() => handleSelectSubCategory('ra&apos;ghon')}>ra&apos;ghon</a></div>
          <div><a onClick={() => handleSelectSubCategory('Vitclari')}>Vitclari</a></div>
          <div><a onClick={() => handleSelectSubCategory('Haladie')}>Haladie</a></div>
          <div><a onClick={() => handleSelectSubCategory('Quoratum')}>Quoratum</a></div>
          <div><a onClick={() => handleSelectSubCategory('Mareca')}>Mareca</a></div>
          <div><a onClick={() => handleSelectSubCategory('Shard')}>Shard</a></div>
          <div><a onClick={() => handleSelectSubCategory('Do Stave')}>Do Stave</a></div>
          <div><a onClick={() => handleSelectSubCategory('Binyeo Knife')}>Binyeo Knife</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Awakening Weapon' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Awakening Weapon')}>Awakening Weapon</a>
      {activeMainCategory === 'Awakening Weapon' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Great Sword')}>Great Sword</a></div>
          <div><a onClick={() => handleSelectSubCategory('Scythe')}>Scythe</a></div>
          <div><a onClick={() => handleSelectSubCategory('Iron Buster')}>Iron Buster</a></div>
          <div><a onClick={() => handleSelectSubCategory('Kamasylven Sword')}>Kamasylven Sword</a></div>
          <div><a onClick={() => handleSelectSubCategory('Celestial Bo Staff')}>Celestial Bo Staff</a></div>
          <div><a onClick={() => handleSelectSubCategory('Lancia')}>Lancia</a></div>
          <div><a onClick={() => handleSelectSubCategory('Crescent Blade')}>CrescentBlade</a></div>
          <div><a onClick={() => handleSelectSubCategory('Kerispear')}>Kerispear</a></div>
          <div><a onClick={() => handleSelectSubCategory('Sura Katana')}>Sura Katana</a></div>
          <div><a onClick={() => handleSelectSubCategory('Sah Chakram')}>Sah Chakram</a></div>
          <div><a onClick={() => handleSelectSubCategory('Aad Sphera')}>Aad Sphera</a></div>
          <div><a onClick={() => handleSelectSubCategory('Godr Sphera')}>Godr Sphera</a></div>
          <div><a onClick={() => handleSelectSubCategory('Vediant')}>Vediant</a></div>
          <div><a onClick={() => handleSelectSubCategory('Gardbrace')}>Gardbrace</a></div>
          <div><a onClick={() => handleSelectSubCategory('Cestus')}>Cestus</a></div>
          <div><a onClick={() => handleSelectSubCategory('Crimson Glaives')}>Crimson Glaives</a></div>
          <div><a onClick={() => handleSelectSubCategory('Greatbow')}>Greatbow</a></div>
          <div><a onClick={() => handleSelectSubCategory('Jordun')}>Jordun</a></div>
          <div><a onClick={() => handleSelectSubCategory('Dual Glaives')}>Dual Glaives</a></div>
          <div><a onClick={() => handleSelectSubCategory('Sting')}>Sting</a></div>
          <div><a onClick={() => handleSelectSubCategory('Kibelius')}>Kibelius</a></div>
          <div><a onClick={() => handleSelectSubCategory('Patraca')}>Patraca</a></div>
          <div><a onClick={() => handleSelectSubCategory('Trion')}>Trion</a></div>
          <div><a onClick={() => handleSelectSubCategory('Soul Tome')}>Soul Tome</a></div>
          <div><a onClick={() => handleSelectSubCategory('Foxtail Fans')}>Foxtail Fans</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Armor' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Armor')}>Armor</a>
      {activeMainCategory === 'Armor' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Helmet')}>Helmet</a></div>
          <div><a onClick={() => handleSelectSubCategory('Armor')}>Armor</a></div>
          <div><a onClick={() => handleSelectSubCategory('Gloves')}>Gloves</a></div>
          <div><a onClick={() => handleSelectSubCategory('Shoes')}>Shoes</a></div>
          <div><a onClick={() => handleSelectSubCategory('Functional Clothes')}>Functional Clothes</a></div>
          <div><a onClick={() => handleSelectSubCategory('Crafted Clothes')}>Crafted Clothes</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Lightstone' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Lightstone')}>Lightstone</a>
      {activeMainCategory === 'Lightstone' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Lightstone Of Fire')}>Lightstone Of Fire</a></div>
          <div><a onClick={() => handleSelectSubCategory('Lightstone Of Earth')}>Lightstone Of Earth</a></div>
          <div><a onClick={() => handleSelectSubCategory('Lightstone Of Earth')}>Lightstone Of Earth</a></div>
          <div><a onClick={() => handleSelectSubCategory('Lightstone Of Earth')}>Lightstone Of Earth</a></div>
          <div><a onClick={() => handleSelectSubCategory('Special Lightstone')}>Special Lightstone</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Accessory' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Accessory')}>Accessories</a>
      {activeMainCategory === 'Accessory' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Ring')}>Ring</a></div>
          <div><a onClick={() => handleSelectSubCategory('Necklace')}>Necklace</a></div>
          <div><a onClick={() => handleSelectSubCategory('Earring')}>Earring</a></div>
          <div><a onClick={() => handleSelectSubCategory('Belt')}>Belt</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Material' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Material')}>Material</a>
      {activeMainCategory === 'Material' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Ore/Gem')}>Ore/Gem</a></div>
          <div><a onClick={() => handleSelectSubCategory('Plants')}>Plants</a></div>
          <div><a onClick={() => handleSelectSubCategory('Seed/Fruit')}>Seed/Fruit</a></div>
          <div><a onClick={() => handleSelectSubCategory('Leather')}>Leather</a></div>
          <div><a onClick={() => handleSelectSubCategory('Blood')}>Blood</a></div>
          <div><a onClick={() => handleSelectSubCategory('Meat')}>Meat</a></div>
          <div><a onClick={() => handleSelectSubCategory('Seafood')}>Seafood</a></div>
          <div><a onClick={() => handleSelectSubCategory('Misc.')}>Misc.</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Enhancement/Upgrade' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Enhancement/Upgrade')}>Enhancement/Upgrade</a>
      {activeMainCategory === 'Enhancement/Upgrade' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Black Stone')}>Black Stone</a></div>
          <div><a onClick={() => handleSelectSubCategory('Upgrade')}>Upgrade</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Consumables' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Consumables')}>Consumables</a>
      {activeMainCategory === 'Consumables' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Offensive Elixir')}>(Elixir) Offensive</a></div>
          <div><a onClick={() => handleSelectSubCategory('Defensive Elixir')}>(Elixir) Defensive</a></div>
          <div><a onClick={() => handleSelectSubCategory('Functional Elixir')}>(Elixir) Functional</a></div>
          <div><a onClick={() => handleSelectSubCategory('Food')}>Food</a></div>
          <div><a onClick={() => handleSelectSubCategory('Potion')}>Potion</a></div>
          <div><a onClick={() => handleSelectSubCategory('Siege Items')}>Siege Items</a></div>
          <div><a onClick={() => handleSelectSubCategory('Item Parts')}>Item Parts</a></div>
          <div><a onClick={() => handleSelectSubCategory('Other Consumables')}>Other consumables</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Life Tools' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Life Tools')}>Life Tools</a>
      {activeMainCategory === 'Life Tools' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Lumbering Axe')}>Lumbering Axe</a></div>
          <div><a onClick={() => handleSelectSubCategory('Fluid Collector')}>Fluid Collector</a></div>
          <div><a onClick={() => handleSelectSubCategory('Butcher Knife')}>Butcher Knife</a></div>
          <div><a onClick={() => handleSelectSubCategory('Pickaxe')}>Pickaxe</a></div>
          <div><a onClick={() => handleSelectSubCategory('Hoe')}>Hoe</a></div>
          <div><a onClick={() => handleSelectSubCategory('Tanning Knife')}>Tanning Knife</a></div>
          <div><a onClick={() => handleSelectSubCategory('Fishing Tools')}>Fishing Tools</a></div>
          <div><a onClick={() => handleSelectSubCategory('Matchlock')}>Matchlock</a></div>
          <div><a onClick={() => handleSelectSubCategory('Alchemy/Cooking')}>Alchemy/Cooking</a></div>
          <div><a onClick={() => handleSelectSubCategory('Other Tools')}>Other Tools</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Alchemy Stone' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Alchemy Stone')}>Alchemy Stone</a>
      {activeMainCategory === 'Alchemy Stone' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Destruction')}>Destruction</a></div>
          <div><a onClick={() => handleSelectSubCategory('Protection')}>Protection</a></div>
          <div><a onClick={() => handleSelectSubCategory('Life')}>Life</a></div>
          <div><a onClick={() => handleSelectSubCategory('Spirit Stone')}>Spirit Stone</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Magic Crystal' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Magic Crystal')}>Life Tools</a>
      {activeMainCategory === 'Magic Crystal' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Main Weapon')}>Main Weapon</a></div>
          <div><a onClick={() => handleSelectSubCategory('Sub-weapon')}>Sub-weapon</a></div>
          <div><a onClick={() => handleSelectSubCategory('Awakening Weapon')}>Awakening Weapon</a></div>
          <div><a onClick={() => handleSelectSubCategory('Helmet')}>Helmet</a></div>
          <div><a onClick={() => handleSelectSubCategory('Armor')}>Armor</a></div>
          <div><a onClick={() => handleSelectSubCategory('Gloves')}>Gloves</a></div>
          <div><a onClick={() => handleSelectSubCategory('Shoes')}>Shoes</a></div>
          <div><a onClick={() => handleSelectSubCategory('Versatile')}>Versatile</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Mount' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Mount')}>Mount Items</a>
      {activeMainCategory === 'Mount' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Registration')}>Registration</a></div>
          <div><a onClick={() => handleSelectSubCategory('Feed')}>Feed</a></div>
          <div><a onClick={() => handleSelectSubCategory('Champron')}>Champron</a></div>
          <div><a onClick={() => handleSelectSubCategory('Barding')}>Barding</a></div>
          <div><a onClick={() => handleSelectSubCategory('Saddle')}>Saddle</a></div>
          <div><a onClick={() => handleSelectSubCategory('Stirrups')}>Stirrups</a></div>
          <div><a onClick={() => handleSelectSubCategory('Horseshoe')}>Horseshoe</a></div>
          <div><a onClick={() => handleSelectSubCategory('[Elephant] Stirrups')}>(Elephant) Stirrups</a></div>
          <div><a onClick={() => handleSelectSubCategory('[Elephant] Armor')}>(Elephant) Armor</a></div>
          <div><a onClick={() => handleSelectSubCategory('[Elephant] Mask')}>(Elephant) Mask</a></div>
          <div><a onClick={() => handleSelectSubCategory('[Elephant] Saddle')}>(Elephant) Saddle</a></div>
          <div><a onClick={() => handleSelectSubCategory('Courser Training')}>Courser Training</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Ship' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Ship')}>Ship Items</a>
      {activeMainCategory === 'Ship' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Registration')}>Registration</a></div>
          <div><a onClick={() => handleSelectSubCategory('Cargo')}>Cargo</a></div>
          <div><a onClick={() => handleSelectSubCategory('Prow')}>Prow</a></div>
          <div><a onClick={() => handleSelectSubCategory('Decoration')}>Decoration</a></div>
          <div><a onClick={() => handleSelectSubCategory('Totem')}>Totem</a></div>
          <div><a onClick={() => handleSelectSubCategory('Prow Statue')}>Prow Statue</a></div>
          <div><a onClick={() => handleSelectSubCategory('Plating')}>Plating</a></div>
          <div><a onClick={() => handleSelectSubCategory('Cannon')}>Cannon</a></div>
          <div><a onClick={() => handleSelectSubCategory('Sail')}>Sail</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Wagon' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Wagon')}>Wagon Items</a>
      {activeMainCategory === 'Wagon' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Registration')}>Registration</a></div>
          <div><a onClick={() => handleSelectSubCategory('Wheel')}>Wheel</a></div>
          <div><a onClick={() => handleSelectSubCategory('Cover')}>Cover</a></div>
          <div><a onClick={() => handleSelectSubCategory('Flag')}>Flag</a></div>
          <div><a onClick={() => handleSelectSubCategory('Emblem')}>Emblem</a></div>
          <div><a onClick={() => handleSelectSubCategory('Lamp')}>Lamp</a></div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Furniture' ? 'category active-menu-category' : 'category'}><a onClick={() => handleSelectMainCategory('Furniture')}>Furniture Items</a>
      {activeMainCategory === 'Furniture' && (
        <div className='marketplace-menu-content'>
          <div><a onClick={() => handleSelectSubCategory('Bed')}>Bed</a></div>
          <div><a onClick={() => handleSelectSubCategory('Bedside Table/Table')}>Bedside Table/Table</a></div>
          <div><a onClick={() => handleSelectSubCategory('Wardrobe/Bookshelf')}>Wardrobe Bookshelf/Bookshelf</a></div>
          <div><a onClick={() => handleSelectSubCategory('Sofa/Chair')}>Sofa/Chair</a></div>
          <div><a onClick={() => handleSelectSubCategory('Chandelier')}>Chandelier</a></div>
          <div><a onClick={() => handleSelectSubCategory('Floor/Carpet')}>Floor/Carpet</a></div>
          <div><a onClick={() => handleSelectSubCategory('Wall/Curtain')}>Wall/Curtain</a></div>
          <div><a onClick={() => handleSelectSubCategory('Decoration')}>Decoration</a></div>
          <div><a onClick={() => handleSelectSubCategory('Others')}>Others</a></div>
        </div>
      )}
      </div>
    </div>
  )
}

MarketplaceMenu.propTypes = {
  handleSearch: PropTypes.func.isRequired
}

export default MarketplaceMenu
