import{j as o,a as l}from"./jsx-runtime-bc5d6cf6.js";import"./index-c013ead5.js";import"./_commonjsHelpers-725317a4.js";const r=({text:e,onClick:i,disabled:d})=>o("button",{onClick:i,className:`button-tertiary ${d?"disabled":""}`,children:l("p",{className:"button-text",children:[" ",e," "]})});try{r.displayName="ButtonTertiary",r.__docgenInfo={description:"",displayName:"ButtonTertiary",props:{text:{defaultValue:null,description:"",name:"text",required:!0,type:{name:"string"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!0,type:{name:"(_: unknown) => void"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}}}}}catch{}const m={component:r},t={args:{disabled:!1,text:"Label"},render:e=>o(r,{...e})};var a,n,s;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    disabled: false,
    text: "Label"
  },
  render: props => <ButtonTertiary {...props} />
}`,...(s=(n=t.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const y=["Tertiary"];export{t as Tertiary,y as __namedExportsOrder,m as default};
