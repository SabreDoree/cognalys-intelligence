"use client";
import { useState } from "react";
import { possibilities } from "@/config/possibilities";
import { Icon } from "./icon";

export function Possibilities() {
  const [selected, setSelected] = useState(0);
  const item = possibilities[selected];
  return <div className="possibilities">
    <div className="possibility-choices" role="group" aria-label="Explorer des exemples de projets">{possibilities.map((option, index) => <button key={option.id} type="button" aria-pressed={index === selected} aria-controls="possibility-detail" onClick={() => setSelected(index)}><Icon name={option.icon} /><span>{option.label}</span></button>)}</div>
    <div id="possibility-detail" className="possibility-detail" aria-live="polite" aria-atomic="true">
      <div className="possibility-heading"><div><p className="eyebrow">{item.audience}</p><h3>{item.title}</h3></div><span className="example-label">UNE POSSIBILITÉ PARMI D’AUTRES</span></div>
      <div className="possibility-comparison"><div className="possibility-before"><span className="comparison-label">AUJOURD’HUI</span><h4>Un besoin à résoudre.</h4><p>{item.before}</p><div className="example-context"><Icon name="spark" /><p><strong>Imaginez dans votre métier</strong>{item.example}</p></div></div><div className="possibility-after"><span className="comparison-label">AVEC UNE SOLUTION ADAPTÉE</span><p className="possibility-trigger">{item.trigger}</p><ol>{item.steps.map((step,index)=><li key={step}><span>{index+1}</span><p>{step}</p></li>)}</ol></div></div>
      <div className="possibility-result"><Icon name="check" /><p><strong>Ce que ça change</strong>{item.result}</p><a className="text-link" href="#contact">J’ai ce besoin<Icon name="arrowUpRight" /></a></div>
      <p className="possibility-boundary"><Icon name="hand" />{item.boundary}</p>
    </div>
  </div>;
}
