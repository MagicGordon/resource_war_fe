(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[781],{3833:function(n,e,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/make-offer",function(){return t(3493)}])},8002:function(n,e,t){"use strict";t.d(e,{Dv:function(){return u},L0:function(){return a},Pz:function(){return c},UE:function(){return s},Zt:function(){return o},uz:function(){return i}});var r=t(3454),u=(r.env.NEXT_PUBLIC_NFT_STORAGE_KEY,r.env.NEXT_PUBLIC_SUPABASE_KEY,r.env.NEXT_PUBLIC_SUPABASE_URL,"ResourceWar"),c="0xd03866045cf7b95a8f1abe65ea7db7fcc045489669ea6fef76fc6d7fddea86ce",a="0xbe2250f80254c16a80ac1d22e2bca43f2c11c8b35179063567534cd8971e6d6e",i="0x1::aptos_coin::AptosCoin",s="https://fullnode.devnet.aptoslabs.com/v1/",o="https://faucet.devnet.aptoslabs.com/v1/"},3493:function(n,e,t){"use strict";t.r(e),t.d(e,{default:function(){return f}});var r=t(7568),u=t(414),c=t(5893),a=t(7294),i=t(1163),s=t(8002),o=t(3032);function f(){var n=(0,i.useRouter)(),e=(0,a.useState)(!1),t=e[0],f=e[1],l=n.query,d=l.creator,p=l.name,_=l.collection,m=(l.uri,l.description,(0,o.useWallet)().signAndSubmitTransaction),b=(0,a.useState)(""),v=b[0],h=b[1];function N(){return(N=(0,r.Z)((function(){var e;return(0,u.__generator)(this,(function(t){switch(t.label){case 0:return f(!0),e={type:"entry_function_payload",function:"".concat(s.Pz,"::marketplace::list_token"),type_arguments:[s.uz],arguments:[s.Pz,s.Dv,d,_,p,"0",v]},[4,m(e,{gas_unit_price:100})];case 1:return t.sent(),f(!1),n.push("/"),[2]}}))}))).apply(this,arguments)}return(0,c.jsxs)("div",{className:"flex flex-col justify-center items-center",children:[(0,c.jsx)("div",{className:"w-1/5 my-8"}),(0,c.jsxs)("div",{className:"w-1/4 flex flex-col pb-12",children:[(0,c.jsx)("input",{type:"number",placeholder:"Asset Price in APT",className:"mt-2 p-4 input input-bordered input-primary w-full",onChange:function(n){return h(n.target.value)}}),(0,c.jsx)("button",{onClick:function(){return N.apply(this,arguments)},className:(t?"loading ":"")+"btn btn-primary font-bold mt-4 text-white rounded p-4 shadow-lg",children:"List NFT"})]})]})}},1163:function(n,e,t){n.exports=t(387)}},function(n){n.O(0,[774,888,179],(function(){return e=3833,n(n.s=e);var e}));var e=n.O();_N_E=e}]);