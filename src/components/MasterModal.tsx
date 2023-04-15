import { FC, useState, useEffect } from 'react';
import siteData from '../app/util';
import { MasterModalProps, MasterType } from '../app/types';
import { calcCalorie, convert2Int } from '../app/func';

const MasterModal: FC<MasterModalProps> = (props) => {
  const {master, action} = props;

  // State
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [sugar, setSugar] = useState<string>('');
  const [fat, setFat] = useState<string>('');
  const [calorie, setCalorie] = useState<number|null>(null);

  // Watch Method
  const closeModal = () => {
    action(); // Send to Parent Component
  }

  const saveMaster = () => {
    const masterItem: MasterType = {
      id: master?.id,
      name: name,
      category: category,
      protein: Number(protein),
      sugar: Number(sugar),
      fat: Number(fat),
      calorie: Number(calorie)
    }
    action(masterItem); // Send to Parent Component
  }

  // Calc Calorie when other changed
  useEffect(() => {
    if (protein === null || sugar === null || fat === null) return;
    setCalorie(calcCalorie(protein, sugar, fat));
  }, [protein, sugar, fat]);

  // Init
  useEffect(() => {
    if (!master) return;
    setName(master.name);
    setCategory(master.category);
    setProtein(String(master.protein));
    setSugar(String(master.sugar));
    setFat(String(master.fat));
    setCalorie(master.calorie);
  }, []);

  return (
    <div className="modal">
      <div className="modal_content master">
        <h3>{siteData.master}</h3>
        <dl>
          <dt>{siteData.name}</dt>
          <dd>
            <input name="name" type="text" onChange={e => setName(e.target.value)} value={name} />
          </dd>
          <dt>{siteData.category}</dt>
          <dd>
            <input name="category" type="text" onChange={e => setCategory(e.target.value)} value={category} />
          </dd>
          <dt>{siteData.protein}</dt>
          <dd>
            <input name="protein" onChange={e => setProtein(convert2Int(e.target.value, 500))} value={protein} />
          </dd>
          <dt>{siteData.sugar}</dt>
          <dd>
            <input name="sugar" onChange={e => setSugar(convert2Int(e.target.value, 500))} value={sugar} />
          </dd>
          <dt>{siteData.fat}</dt>
          <dd>
            <input name="fat" onChange={e => setFat(convert2Int(e.target.value, 500))} value={fat} />
          </dd>
          <dt>{siteData.calorie}</dt>
          <dd>{calorie}</dd>
        </dl>
        <button className="save" onClick={saveMaster}>{siteData.save}</button>
      </div>
      <div className="close" onClick={closeModal}><span className="close_icon"></span></div>
      <div className="overlay"></div>
    </div>
  );
};
export default MasterModal;
