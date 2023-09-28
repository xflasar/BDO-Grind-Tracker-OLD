import React, { useState } from 'react'
import PropTypes from 'prop-types'
import '../../assets/pages/Marketplace/MarketplaceMenu.scss'

// TODO:
// Registration queue function
// Items images store locally
// Fix empty categories
// reformat whole menu
const MarketplaceMenu = ({ handleSearch }) => {
  const [activeMainCategory, setMainActiveCategory] = useState('')

  const handleSelectSubCategory = (value) => {
    handleSearch(activeMainCategory, value)
  }

  const handleSelectMainCategory = (value) => {
    setMainActiveCategory(value)
  }

  return (
    <div className='marketplace-menu'>
      <div className={activeMainCategory === 'RegistrationQueue' ? 'category active-menu-category' : 'category'} onClick={() => {
        handleSelectMainCategory('Registration Queue')
        handleSearch('Registration Queue', '')
      }}>Registration Queue
      </div>
      <div className={activeMainCategory === 'Main Weapon' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Main Weapon')}>Main Weapon
      {activeMainCategory === 'Main Weapon' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Longsword')}>Longsword</div>
          <div onClick={() => handleSelectSubCategory('Longbow')}>Longbow</div>
          <div onClick={() => handleSelectSubCategory('Amulet')}>Amulet</div>
          <div onClick={() => handleSelectSubCategory('Axe')}>Axe</div>
          <div onClick={() => handleSelectSubCategory('Shortsword')}>Shortsword</div>
          <div onClick={() => handleSelectSubCategory('Blade')}>Blade</div>
          <div onClick={() => handleSelectSubCategory('Staff')}>Staff</div>
          <div onClick={() => handleSelectSubCategory('Kriegsmesser')}>Kriegsmesser</div>
          <div onClick={() => handleSelectSubCategory('Gauntlet')}>Gauntlet</div>
          <div onClick={() => handleSelectSubCategory('Crescent Pendulum')}>Crescent Pendulum</div>
          <div onClick={() => handleSelectSubCategory('Crossbow')}>Crossbow</div>
          <div onClick={() => handleSelectSubCategory('Florang')}>Florang</div>
          <div onClick={() => handleSelectSubCategory('Battle Axe')}>Battle Axe</div>
          <div onClick={() => handleSelectSubCategory('Shamshir')}>Shamshir</div>
          <div onClick={() => handleSelectSubCategory('Morning Star')}>Morning Star</div>
          <div onClick={() => handleSelectSubCategory('Kyve')}>Kyve</div>
          <div onClick={() => handleSelectSubCategory('Serenaca')}>Serenaca</div>
          <div onClick={() => handleSelectSubCategory('Slayer')}>Slayer</div>
          <div onClick={() => handleSelectSubCategory('Swallowtail Fan')}>Swallowtail Fan</div>
        </div>
      )}</div>
      <div className={activeMainCategory === 'Sub Weapon' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Sub Weapon')}>Sub Weapon
      {activeMainCategory === 'Sub Weapon' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Shield')}>Shield</div>
          <div onClick={() => handleSelectSubCategory('Dagger')}>Dagger</div>
          <div onClick={() => handleSelectSubCategory('Talisman')}>Talisman</div>
          <div onClick={() => handleSelectSubCategory('Ornamental Knot')}>Ornamental Knot</div>
          <div onClick={() => handleSelectSubCategory('Trinket')}>Trinket</div>
          <div onClick={() => handleSelectSubCategory('Horn Bow')}>Horn Bow</div>
          <div onClick={() => handleSelectSubCategory('Kunai')}>Kunai</div>
          <div onClick={() => handleSelectSubCategory('Shuriken')}>Shuriken</div>
          <div onClick={() => handleSelectSubCategory('Vambrace')}>Vambrace</div>
          <div onClick={() => handleSelectSubCategory('Noble Sword')}>Noble Sword</div>
          <div onClick={() => handleSelectSubCategory('ra&apos;ghon')}>ra&apos;ghon</div>
          <div onClick={() => handleSelectSubCategory('Vitclari')}>Vitclari</div>
          <div onClick={() => handleSelectSubCategory('Haladie')}>Haladie</div>
          <div onClick={() => handleSelectSubCategory('Quoratum')}>Quoratum</div>
          <div onClick={() => handleSelectSubCategory('Mareca')}>Mareca</div>
          <div onClick={() => handleSelectSubCategory('Shard')}>Shard</div>
          <div onClick={() => handleSelectSubCategory('Do Stave')}>Do Stave</div>
          <div onClick={() => handleSelectSubCategory('Binyeo Knife')}>Binyeo Knife</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Awakening Weapon' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Awakening Weapon')}>Awakening Weapon
      {activeMainCategory === 'Awakening Weapon' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Great Sword')}>Great Sword</div>
          <div onClick={() => handleSelectSubCategory('Scythe')}>Scythe</div>
          <div onClick={() => handleSelectSubCategory('Iron Buster')}>Iron Buster</div>
          <div onClick={() => handleSelectSubCategory('Kamasylven Sword')}>Kamasylven Sword</div>
          <div onClick={() => handleSelectSubCategory('Celestial Bo Staff')}>Celestial Bo Staff</div>
          <div onClick={() => handleSelectSubCategory('Lancia')}>Lancia</div>
          <div onClick={() => handleSelectSubCategory('Crescent Blade')}>CrescentBlade</div>
          <div onClick={() => handleSelectSubCategory('Kerispear')}>Kerispear</div>
          <div onClick={() => handleSelectSubCategory('Sura Katana')}>Sura Katana</div>
          <div onClick={() => handleSelectSubCategory('Sah Chakram')}>Sah Chakram</div>
          <div onClick={() => handleSelectSubCategory('Aad Sphera')}>Aad Sphera</div>
          <div onClick={() => handleSelectSubCategory('Godr Sphera')}>Godr Sphera</div>
          <div onClick={() => handleSelectSubCategory('Vediant')}>Vediant</div>
          <div onClick={() => handleSelectSubCategory('Gardbrace')}>Gardbrace</div>
          <div onClick={() => handleSelectSubCategory('Cestus')}>Cestus</div>
          <div onClick={() => handleSelectSubCategory('Crimson Glaives')}>Crimson Glaives</div>
          <div onClick={() => handleSelectSubCategory('Greatbow')}>Greatbow</div>
          <div onClick={() => handleSelectSubCategory('Jordun')}>Jordun</div>
          <div onClick={() => handleSelectSubCategory('Dual Glaives')}>Dual Glaives</div>
          <div onClick={() => handleSelectSubCategory('Sting')}>Sting</div>
          <div onClick={() => handleSelectSubCategory('Kibelius')}>Kibelius</div>
          <div onClick={() => handleSelectSubCategory('Patraca')}>Patraca</div>
          <div onClick={() => handleSelectSubCategory('Trion')}>Trion</div>
          <div onClick={() => handleSelectSubCategory('Soul Tome')}>Soul Tome</div>
          <div onClick={() => handleSelectSubCategory('Foxtail Fans')}>Foxtail Fans</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Armor' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Armor')}>Armor
      {activeMainCategory === 'Armor' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Helmet')}>Helmet</div>
          <div onClick={() => handleSelectSubCategory('Armor')}>Armor</div>
          <div onClick={() => handleSelectSubCategory('Gloves')}>Gloves</div>
          <div onClick={() => handleSelectSubCategory('Shoes')}>Shoes</div>
          <div onClick={() => handleSelectSubCategory('Functional Clothes')}>Functional Clothes</div>
          <div onClick={() => handleSelectSubCategory('Crafted Clothes')}>Crafted Clothes</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Lightstone' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Lightstone')}>Lightstone
      {activeMainCategory === 'Lightstone' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Lightstone Of Fire')}>Lightstone Of Fire</div>
          <div onClick={() => handleSelectSubCategory('Lightstone Of Earth')}>Lightstone Of Earth</div>
          <div onClick={() => handleSelectSubCategory('Lightstone Of Earth')}>Lightstone Of Earth</div>
          <div onClick={() => handleSelectSubCategory('Lightstone Of Earth')}>Lightstone Of Earth</div>
          <div onClick={() => handleSelectSubCategory('Special Lightstone')}>Special Lightstone</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Accessory' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Accessory')}>Accessories
      {activeMainCategory === 'Accessory' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Ring')}>Ring</div>
          <div onClick={() => handleSelectSubCategory('Necklace')}>Necklace</div>
          <div onClick={() => handleSelectSubCategory('Earring')}>Earring</div>
          <div onClick={() => handleSelectSubCategory('Belt')}>Belt</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Material' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Material')}>Material
      {activeMainCategory === 'Material' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Ore/Gem')}>Ore/Gem</div>
          <div onClick={() => handleSelectSubCategory('Plants')}>Plants</div>
          <div onClick={() => handleSelectSubCategory('Seed/Fruit')}>Seed/Fruit</div>
          <div onClick={() => handleSelectSubCategory('Leather')}>Leather</div>
          <div onClick={() => handleSelectSubCategory('Blood')}>Blood</div>
          <div onClick={() => handleSelectSubCategory('Meat')}>Meat</div>
          <div onClick={() => handleSelectSubCategory('Seafood')}>Seafood</div>
          <div onClick={() => handleSelectSubCategory('Misc.')}>Misc.</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Enhancement/Upgrade' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Enhancement/Upgrade')}>Enhancement/Upgrade
      {activeMainCategory === 'Enhancement/Upgrade' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Black Stone')}>Black Stone</div>
          <div onClick={() => handleSelectSubCategory('Upgrade')}>Upgrade</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Consumables' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Consumables')}>Consumables
      {activeMainCategory === 'Consumables' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Offensive Elixir')}>(Elixir) Offensive</div>
          <div onClick={() => handleSelectSubCategory('Defensive Elixir')}>(Elixir) Defensive</div>
          <div onClick={() => handleSelectSubCategory('Functional Elixir')}>(Elixir) Functional</div>
          <div onClick={() => handleSelectSubCategory('Food')}>Food</div>
          <div onClick={() => handleSelectSubCategory('Potion')}>Potion</div>
          <div onClick={() => handleSelectSubCategory('Siege Items')}>Siege Items</div>
          <div onClick={() => handleSelectSubCategory('Item Parts')}>Item Parts</div>
          <div onClick={() => handleSelectSubCategory('Other Consumables')}>Other consumables</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Life Tools' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Life Tools')}>Life Tools
      {activeMainCategory === 'Life Tools' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Lumbering Axe')}>Lumbering Axe</div>
          <div onClick={() => handleSelectSubCategory('Fluid Collector')}>Fluid Collector</div>
          <div onClick={() => handleSelectSubCategory('Butcher Knife')}>Butcher Knife</div>
          <div onClick={() => handleSelectSubCategory('Pickaxe')}>Pickaxe</div>
          <div onClick={() => handleSelectSubCategory('Hoe')}>Hoe</div>
          <div onClick={() => handleSelectSubCategory('Tanning Knife')}>Tanning Knife</div>
          <div onClick={() => handleSelectSubCategory('Fishing Tools')}>Fishing Tools</div>
          <div onClick={() => handleSelectSubCategory('Matchlock')}>Matchlock</div>
          <div onClick={() => handleSelectSubCategory('Alchemy/Cooking')}>Alchemy/Cooking</div>
          <div onClick={() => handleSelectSubCategory('Other Tools')}>Other Tools</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Alchemy Stone' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Alchemy Stone')}>Alchemy Stone
      {activeMainCategory === 'Alchemy Stone' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Destruction')}>Destruction</div>
          <div onClick={() => handleSelectSubCategory('Protection')}>Protection</div>
          <div onClick={() => handleSelectSubCategory('Life')}>Life</div>
          <div onClick={() => handleSelectSubCategory('Spirit Stone')}>Spirit Stone</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Magic Crystal' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Magic Crystal')}>Life Tools
      {activeMainCategory === 'Magic Crystal' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Main Weapon')}>Main Weapon</div>
          <div onClick={() => handleSelectSubCategory('Sub-weapon')}>Sub-weapon</div>
          <div onClick={() => handleSelectSubCategory('Awakening Weapon')}>Awakening Weapon</div>
          <div onClick={() => handleSelectSubCategory('Helmet')}>Helmet</div>
          <div onClick={() => handleSelectSubCategory('Armor')}>Armor</div>
          <div onClick={() => handleSelectSubCategory('Gloves')}>Gloves</div>
          <div onClick={() => handleSelectSubCategory('Shoes')}>Shoes</div>
          <div onClick={() => handleSelectSubCategory('Versatile')}>Versatile</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Mount' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Mount')}>Mount Items
      {activeMainCategory === 'Mount' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Registration')}>Registration</div>
          <div onClick={() => handleSelectSubCategory('Feed')}>Feed</div>
          <div onClick={() => handleSelectSubCategory('Champron')}>Champron</div>
          <div onClick={() => handleSelectSubCategory('Barding')}>Barding</div>
          <div onClick={() => handleSelectSubCategory('Saddle')}>Saddle</div>
          <div onClick={() => handleSelectSubCategory('Stirrups')}>Stirrups</div>
          <div onClick={() => handleSelectSubCategory('Horseshoe')}>Horseshoe</div>
          <div onClick={() => handleSelectSubCategory('[Elephant] Stirrups')}>(Elephant) Stirrups</div>
          <div onClick={() => handleSelectSubCategory('[Elephant] Armor')}>(Elephant) Armor</div>
          <div onClick={() => handleSelectSubCategory('[Elephant] Mask')}>(Elephant) Mask</div>
          <div onClick={() => handleSelectSubCategory('[Elephant] Saddle')}>(Elephant) Saddle</div>
          <div onClick={() => handleSelectSubCategory('Courser Training')}>Courser Training</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Ship' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Ship')}>Ship Items
      {activeMainCategory === 'Ship' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Registration')}>Registration</div>
          <div onClick={() => handleSelectSubCategory('Cargo')}>Cargo</div>
          <div onClick={() => handleSelectSubCategory('Prow')}>Prow</div>
          <div onClick={() => handleSelectSubCategory('Decoration')}>Decoration</div>
          <div onClick={() => handleSelectSubCategory('Totem')}>Totem</div>
          <div onClick={() => handleSelectSubCategory('Prow Statue')}>Prow Statue</div>
          <div onClick={() => handleSelectSubCategory('Plating')}>Plating</div>
          <div onClick={() => handleSelectSubCategory('Cannon')}>Cannon</div>
          <div onClick={() => handleSelectSubCategory('Sail')}>Sail</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Wagon' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Wagon')}>Wagon Items
      {activeMainCategory === 'Wagon' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Registration')}>Registration</div>
          <div onClick={() => handleSelectSubCategory('Wheel')}>Wheel</div>
          <div onClick={() => handleSelectSubCategory('Cover')}>Cover</div>
          <div onClick={() => handleSelectSubCategory('Flag')}>Flag</div>
          <div onClick={() => handleSelectSubCategory('Emblem')}>Emblem</div>
          <div onClick={() => handleSelectSubCategory('Lamp')}>Lamp</div>
        </div>
      )}
      </div>
      <div className={activeMainCategory === 'Furniture' ? 'category active-menu-category' : 'category'} onClick={() => handleSelectMainCategory('Furniture')}>Furniture Items
      {activeMainCategory === 'Furniture' && (
        <div className='marketplace-menu-content'>
          <div onClick={() => handleSelectSubCategory('Bed')}>Bed</div>
          <div onClick={() => handleSelectSubCategory('Bedside Table/Table')}>Bedside Table/Table</div>
          <div onClick={() => handleSelectSubCategory('Wardrobe/Bookshelf')}>Wardrobe Bookshelf/Bookshelf</div>
          <div onClick={() => handleSelectSubCategory('Sofa/Chair')}>Sofa/Chair</div>
          <div onClick={() => handleSelectSubCategory('Chandelier')}>Chandelier</div>
          <div onClick={() => handleSelectSubCategory('Floor/Carpet')}>Floor/Carpet</div>
          <div onClick={() => handleSelectSubCategory('Wall/Curtain')}>Wall/Curtain</div>
          <div onClick={() => handleSelectSubCategory('Decoration')}>Decoration</div>
          <div onClick={() => handleSelectSubCategory('Others')}>Others</div>
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
