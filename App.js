/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║       HealthAI — AI Healthcare Management System            ║
 * ║       React Native (Expo) — Full Mobile App                 ║
 * ║       FYP Project · Lahore Garrison University · BSCS       ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  FlatList, Alert, Linking, KeyboardAvoidingView, Platform,
  Dimensions, StatusBar, Modal, ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SW } = Dimensions.get('window');

// ─── THEME ───────────────────────────────────────────────────────
const T = {
  bg: '#0A0F1E', surface: '#111827', surfaceLight: '#1a2235',
  border: '#1e3a5f', accent: '#00C2FF', accentGlow: '#00C2FF22',
  accentGreen: '#00E5A0', accentRed: '#FF4D6A', accentYellow: '#FFB800',
  text: '#E8F4FF', textMuted: '#6B8CAE', textDim: '#3d5a78',
};

// ─── DATA ────────────────────────────────────────────────────────
const DOCTORS = [
  { id:1, name:'Dr. Sarah Ahmed',  spec:'Cardiologist',     rating:4.8, exp:'12 yrs', fee:'Rs. 2,500', emoji:'🫀', avail:true,  slots:['9:00 AM','10:30 AM','2:00 PM','4:00 PM'],   address:'Gulberg III, Lahore' },
  { id:2, name:'Dr. Usman Khan',   spec:'Neurologist',       rating:4.6, exp:'9 yrs',  fee:'Rs. 3,000', emoji:'🧠', avail:true,  slots:['11:00 AM','1:00 PM','3:30 PM'],              address:'DHA Phase 5, Lahore' },
  { id:3, name:'Dr. Fatima Malik', spec:'Dermatologist',     rating:4.9, exp:'7 yrs',  fee:'Rs. 1,800', emoji:'🌿', avail:true,  slots:['9:30 AM','11:30 AM','2:30 PM','5:00 PM'],    address:'Model Town, Lahore' },
  { id:4, name:'Dr. Ali Raza',     spec:'Orthopedist',       rating:4.7, exp:'15 yrs', fee:'Rs. 2,200', emoji:'🦴', avail:false, slots:['10:00 AM','12:00 PM','3:00 PM'],              address:'Garden Town, Lahore' },
  { id:5, name:'Dr. Nadia Shah',   spec:'Pediatrician',      rating:4.9, exp:'11 yrs', fee:'Rs. 1,500', emoji:'👶', avail:true,  slots:['9:00 AM','10:00 AM','1:30 PM','4:30 PM'],    address:'Bahria Town, Lahore' },
  { id:6, name:'Dr. Hassan Baig',  spec:'General Physician', rating:4.5, exp:'6 yrs',  fee:'Rs. 1,000', emoji:'🏥', avail:true,  slots:['8:30 AM','10:30 AM','12:30 PM','3:00 PM'],   address:'Johar Town, Lahore' },
];

const MEDICINES = [
  { id:1, name:'Paracetamol 500mg',  type:'Analgesic',    price:'Rs. 120', stock:85, unit:'Strip of 10', uses:'Fever, mild pain' },
  { id:2, name:'Amoxicillin 250mg',  type:'Antibiotic',   price:'Rs. 280', stock:60, unit:'Pack of 15',  uses:'Bacterial infections' },
  { id:3, name:'Omeprazole 20mg',    type:'PPI',          price:'Rs. 180', stock:70, unit:'Strip of 14', uses:'Acidity, GERD' },
  { id:4, name:'Cetirizine 10mg',    type:'Antihistamine',price:'Rs. 95',  stock:90, unit:'Strip of 10', uses:'Allergies, cold' },
  { id:5, name:'Metformin 500mg',    type:'Antidiabetic', price:'Rs. 220', stock:45, unit:'Pack of 30',  uses:'Diabetes type 2' },
  { id:6, name:'Ibuprofen 400mg',    type:'NSAID',        price:'Rs. 140', stock:78, unit:'Strip of 10', uses:'Pain, inflammation' },
  { id:7, name:'Azithromycin 500mg', type:'Antibiotic',   price:'Rs. 420', stock:30, unit:'Pack of 3',   uses:'Respiratory infections' },
  { id:8, name:'Atorvastatin 20mg',  type:'Statin',       price:'Rs. 350', stock:55, unit:'Pack of 30',  uses:'Cholesterol' },
];

const BLOOD_TYPES = [
  {type:'A+',units:12,donors:8},{type:'A-',units:4,donors:3},
  {type:'B+',units:18,donors:11},{type:'B-',units:3,donors:2},
  {type:'AB+',units:7,donors:5},{type:'AB-',units:2,donors:1},
  {type:'O+',units:22,donors:15},{type:'O-',units:6,donors:4},
];

const DONORS = [
  {name:'Ahmad Raza',  blood:'O+', city:'Lahore',last:'2 months ago',phone:'0300-1234567'},
  {name:'Sana Mirza',  blood:'A+', city:'Lahore',last:'1 month ago', phone:'0311-9876543'},
  {name:'Bilal Hassan',blood:'B+', city:'Lahore',last:'3 months ago',phone:'0321-5556677'},
  {name:'Zara Hussain',blood:'O-', city:'Lahore',last:'6 weeks ago', phone:'0333-4441122'},
  {name:'Imran Sheikh',blood:'AB+',city:'Lahore',last:'5 months ago',phone:'0345-7788990'},
];

const NEARBY = [
  {id:1,type:'doctor',  name:'Dr. Sarah Ahmed Clinic', spec:'Cardiologist',      addr:'Gulberg III',  dist:'1.2 km',rating:4.8,lat:31.5204,lng:74.3587},
  {id:2,type:'doctor',  name:'Dr. Usman Khan',          spec:'Neurologist',       addr:'DHA Phase 5',  dist:'2.8 km',rating:4.6,lat:31.4730,lng:74.4012},
  {id:3,type:'doctor',  name:'Dr. Fatima Malik',        spec:'Dermatologist',     addr:'Model Town',   dist:'3.1 km',rating:4.9,lat:31.4826,lng:74.3209},
  {id:4,type:'pharmacy',name:'MedPlus Pharmacy',        spec:'24/7 Open',         addr:'Gulberg II',   dist:'0.8 km',rating:4.7,lat:31.5156,lng:74.3524},
  {id:5,type:'pharmacy',name:'City Pharmacy',           spec:'Open till 11 PM',   addr:'Liberty Mkt',  dist:'1.5 km',rating:4.4,lat:31.5189,lng:74.3440},
  {id:6,type:'pharmacy',name:'HealthPlus Chemist',      spec:'Open 24/7',         addr:'DHA Phase 1',  dist:'3.4 km',rating:4.6,lat:31.4890,lng:74.3924},
  {id:7,type:'hospital',name:'Lahore General Hospital', spec:'Emergency 24/7',    addr:'Jail Road',    dist:'2.1 km',rating:4.2,lat:31.5497,lng:74.3436},
  {id:8,type:'hospital',name:'Services Hospital',       spec:'Emergency 24/7',    addr:'Shadman',      dist:'2.9 km',rating:4.0,lat:31.5345,lng:74.3298},
  {id:9,type:'hospital',name:'Shaukat Khanum Hospital', spec:'Specialist',        addr:'Johar Town',   dist:'4.8 km',rating:4.9,lat:31.4702,lng:74.2700},
];

const SYMPTOMS = ['Fever','Headache','Chest pain','Skin rash','Back pain','Cough','Stomach ache','Joint pain','Dizziness'];

// ─── AI API ──────────────────────────────────────────────────────
const AI_SYSTEM = `You are HealthBot, AI medical assistant for HealthAI Pakistan. Analyze symptoms, recommend specialists (General Physician, Cardiologist, Neurologist, Dermatologist, Orthopedist, Pediatrician), suggest OTC medicines (Paracetamol, Ibuprofen, Cetirizine, Omeprazole). Use **bold** for medicines and specialists. Max 150 words. Emergencies: call 115. Never diagnose, only guide.`;

async function callAI(history) {
  // ⚠️ REPLACE with your actual Anthropic API key
  const API_KEY = 'YOUR_ANTHROPIC_API_KEY_HERE';
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: AI_SYSTEM, messages: history }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || 'API error'); }
  const d = await res.json();
  return d.content[0].text;
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────
const GBtn = ({ colors, onPress, label, style, disabled, small }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.82} style={style}>
    <LinearGradient colors={disabled ? ['#1a2a3a','#0f1e2e'] : colors}
      style={[s.gBtn, small && s.gBtnSm]}>
      <Text style={[s.gBtnTxt, small && {fontSize:12}]}>{label}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const Chip = ({ label, active, onPress, color }) => (
  <TouchableOpacity onPress={onPress}
    style={[s.chip, active && {borderColor: color||T.accent, backgroundColor:(color||T.accent)+'18'}]}>
    <Text style={[s.chipTxt, active && {color: color||T.accent, fontWeight:'700'}]}>{label}</Text>
  </TouchableOpacity>
);

const Badge = ({ label, color }) => (
  <View style={{paddingHorizontal:9,paddingVertical:3,borderRadius:20,backgroundColor:color+'22',borderWidth:1,borderColor:color+'55'}}>
    <Text style={{fontSize:10,fontWeight:'600',color}}>{label}</Text>
  </View>
);

const Card = ({ children, style, onPress }) => {
  const Wrap = onPress ? TouchableOpacity : View;
  return <Wrap onPress={onPress} activeOpacity={0.85} style={[s.card, style]}>{children}</Wrap>;
};

const BoldText = ({ text, style }) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <Text style={[{color:T.text,fontSize:14,lineHeight:22},style]}>
      {parts.map((p,i) => i%2===1
        ? <Text key={i} style={{fontWeight:'800',color:T.accent}}>{p}</Text>
        : p)}
    </Text>
  );
};

const ScreenHeader = ({ title, sub, right }) => (
  <LinearGradient colors={['#111827','#0A0F1E']}
    style={{paddingHorizontal:20,paddingVertical:14,borderBottomWidth:1,borderBottomColor:T.border,
            flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
    <View style={{flex:1}}>
      <Text style={{fontSize:22,fontWeight:'900',color:T.text,letterSpacing:-0.3}}>{title}</Text>
      {sub && <Text style={{fontSize:12,color:T.textMuted,marginTop:2}}>{sub}</Text>}
    </View>
    {right}
  </LinearGradient>
);

const getTime = () => new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});

// ─── DASHBOARD ───────────────────────────────────────────────────
function HomeScreen({ navigation }) {
  const stats = [
    {label:'Doctors Available',val:'6', change:'+2 today',  color:T.accent,      icon:'👨‍⚕️'},
    {label:'Medicines',        val:'8', change:'All stocked',color:T.accentGreen, icon:'💊'},
    {label:'Blood Units',      val:'74',change:'8 types',    color:T.accentRed,   icon:'🩸'},
    {label:'AI Consults',      val:'1.2K',change:'+18% week',color:T.accentYellow,icon:'🤖'},
  ];
  const actions = [
    {label:'AI Symptom\nCheck',icon:'🤖',tab:'Chat',    colors:['#00C2FF','#0057FF']},
    {label:'Book\nDoctor',     icon:'📅',tab:'Doctors', colors:['#00E5A0','#00A878']},
    {label:'Find\nMedicine',   icon:'💊',tab:'Pharmacy',colors:['#FFB800','#FF8C00']},
    {label:'Blood\nRequest',   icon:'🩸',tab:'Blood',   colors:['#FF4D6A','#C0392B']},
  ];
  const activity = [
    {text:'Dr. Sarah Ahmed added 2 new slots',  time:'5 min ago', color:T.accent},
    {text:'O+ blood request fulfilled — Lahore', time:'22 min ago',color:T.accentRed},
    {text:'New stock: Azithromycin 500mg',        time:'1 hr ago',  color:T.accentGreen},
    {text:'AI helped 12 patients today',          time:'2 hrs ago', color:T.accentYellow},
  ];

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <LinearGradient colors={['#111827','#0A0F1E']}
        style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',
                paddingHorizontal:20,paddingVertical:14,borderBottomWidth:1,borderBottomColor:T.border}}>
        <View>
          <Text style={{fontSize:24,fontWeight:'900',color:T.accent,letterSpacing:-0.5}}>HealthAI</Text>
          <Text style={{fontSize:9,color:T.textMuted,letterSpacing:1,marginTop:1}}>AI HEALTHCARE MANAGEMENT SYSTEM</Text>
        </View>
        <LinearGradient colors={['#00C2FF','#0057FF']}
          style={{width:38,height:38,borderRadius:19,alignItems:'center',justifyContent:'center'}}>
          <Text style={{color:'#fff',fontWeight:'800',fontSize:16}}>M</Text>
        </LinearGradient>
      </LinearGradient>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding:16,gap:12}}>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>
          {stats.map((st,i) => (
            <Card key={i} style={{width:(SW-42)/2,padding:14,gap:4}}>
              <Text style={{fontSize:26}}>{st.icon}</Text>
              <Text style={{fontSize:28,fontWeight:'900',color:st.color}}>{st.val}</Text>
              <Text style={{fontSize:11,color:T.textMuted}}>{st.label}</Text>
              <Text style={{fontSize:10,color:st.color}}>{st.change}</Text>
            </Card>
          ))}
        </View>
        <Card>
          <Text style={s.secLabel}>QUICK ACTIONS</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
            {actions.map((a,i) => (
              <TouchableOpacity key={i} style={{width:(SW-56)/2}} activeOpacity={0.85}
                onPress={()=>navigation.navigate(a.tab)}>
                <LinearGradient colors={a.colors} style={{borderRadius:12,padding:16,minHeight:88}}>
                  <Text style={{fontSize:28,marginBottom:6}}>{a.icon}</Text>
                  <Text style={{color:'#fff',fontWeight:'800',fontSize:12,lineHeight:16}}>{a.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
        <Card>
          <Text style={s.secLabel}>RECENT ACTIVITY</Text>
          {activity.map((a,i) => (
            <View key={i} style={{flexDirection:'row',alignItems:'center',gap:10,
              paddingVertical:10,borderBottomWidth:i<activity.length-1?1:0,borderBottomColor:T.border}}>
              <View style={{width:8,height:8,borderRadius:4,backgroundColor:a.color}}/>
              <Text style={{flex:1,color:T.text,fontSize:12}} numberOfLines={1}>{a.text}</Text>
              <Text style={{fontSize:10,color:T.textMuted}}>{a.time}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── AI CHAT ─────────────────────────────────────────────────────
function ChatScreen() {
  const [msgs, setMsgs] = useState([
    {role:'bot',text:"Hello! I'm your **AI Health Assistant** 🏥\n\nI can help you:\n• Analyze symptoms\n• Recommend doctors\n• Suggest medicines\n\nHow are you feeling today?",time:getTime()}
  ]);
  const [hist, setHist] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef();

  useEffect(()=>{
    setTimeout(()=>scrollRef.current?.scrollToEnd({animated:true}),120);
  },[msgs]);

  const send = async (txt) => {
    const msg = (txt||input).trim();
    if (!msg || busy) return;
    setInput('');
    setMsgs(m=>[...m,{role:'user',text:msg,time:getTime()}]);
    const nh = [...hist,{role:'user',content:msg}];
    setHist(nh); setBusy(true);
    try {
      const reply = await callAI(nh);
      setMsgs(m=>[...m,{role:'bot',text:reply,time:getTime()}]);
      setHist(h=>[...h,{role:'assistant',content:reply}]);
    } catch(e) {
      setMsgs(m=>[...m,{role:'bot',text:`⚠️ Error: ${e.message}`,time:getTime()}]);
    } finally { setBusy(false); }
  };

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScreenHeader title="AI Symptom Checker" sub="Powered by Claude AI"/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{maxHeight:46,borderBottomWidth:1,borderBottomColor:T.border}}
        contentContainerStyle={{paddingHorizontal:14,gap:8,paddingVertical:8,alignItems:'center'}}>
        {SYMPTOMS.map(sym=>(
          <TouchableOpacity key={sym} onPress={()=>send(sym)} disabled={busy}
            style={{paddingHorizontal:12,paddingVertical:6,backgroundColor:T.surfaceLight,
                    borderRadius:16,borderWidth:1,borderColor:T.border}}>
            <Text style={{color:T.textMuted,fontSize:12}}>+ {sym}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView ref={scrollRef} style={{flex:1}} contentContainerStyle={{padding:14,gap:10}}>
        {msgs.map((m,i)=>(
          <View key={i} style={{flexDirection:'row',justifyContent:m.role==='user'?'flex-end':'flex-start',alignItems:'flex-end',gap:8}}>
            {m.role==='bot'&&<Text style={{fontSize:20,marginBottom:4}}>🤖</Text>}
            <View style={{maxWidth:'78%'}}>
              {m.role==='user'
                ?<LinearGradient colors={['#00C2FF','#0057FF']}
                    style={{borderRadius:16,borderBottomRightRadius:4,padding:12}}>
                    <Text style={{color:'#fff',fontSize:14,lineHeight:21}}>{m.text}</Text>
                  </LinearGradient>
                :<View style={{backgroundColor:T.surfaceLight,borderRadius:16,borderBottomLeftRadius:4,
                               padding:12,borderWidth:1,borderColor:T.border}}>
                    <BoldText text={m.text}/>
                  </View>
              }
              <Text style={{fontSize:10,color:T.textDim,marginTop:3,paddingHorizontal:4,
                textAlign:m.role==='user'?'right':'left'}}>{m.time}</Text>
            </View>
          </View>
        ))}
        {busy&&(
          <View style={{flexDirection:'row',alignItems:'flex-end',gap:8}}>
            <Text style={{fontSize:20}}>🤖</Text>
            <View style={{backgroundColor:T.surfaceLight,borderRadius:16,borderBottomLeftRadius:4,
                          padding:14,borderWidth:1,borderColor:T.border}}>
              <ActivityIndicator size="small" color={T.accent}/>
            </View>
          </View>
        )}
        <View style={{height:4}}/>
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} keyboardVerticalOffset={80}>
        <View style={{flexDirection:'row',padding:12,borderTopWidth:1,borderTopColor:T.border,
                      backgroundColor:T.surface,alignItems:'flex-end',gap:8}}>
          <TextInput style={[s.input,{flex:1}]} placeholder="Describe your symptoms…"
            placeholderTextColor={T.textDim} value={input} onChangeText={setInput}
            onSubmitEditing={()=>send()} editable={!busy} returnKeyType="send" multiline/>
          <GBtn colors={['#00C2FF','#0057FF']} onPress={()=>send()} label="→" disabled={busy}/>
        </View>
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',
                      paddingVertical:6,backgroundColor:T.surfaceLight,borderTopWidth:1,borderTopColor:T.border}}>
          <Text style={{color:T.textMuted,fontSize:12}}>🚨 Emergency? Call </Text>
          <TouchableOpacity onPress={()=>Linking.openURL('tel:115')}>
            <Text style={{color:T.accentRed,fontSize:12,fontWeight:'800'}}>115 Rescue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── DOCTORS ─────────────────────────────────────────────────────
function DoctorsScreen() {
  const [search,setSearch] = useState('');
  const [specF,setSpecF] = useState('All');
  const [selSlots,setSelSlots] = useState({});
  const [bookedSlots,setBookedSlots] = useState({});
  const [bookDoc,setBookDoc] = useState(null);
  const [form,setForm] = useState({name:'',phone:'',date:''});
  const [ok,setOk] = useState(null);
  const specs = ['All',...new Set(DOCTORS.map(d=>d.spec))];
  const list = DOCTORS.filter(d=>{
    if(specF!=='All'&&d.spec!==specF) return false;
    if(search&&!d.name.toLowerCase().includes(search.toLowerCase())&&
       !d.spec.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const doBook = () => {
    if(!form.name||!form.date){Alert.alert('Missing Info','Enter name and date.');return;}
    const sl = selSlots[bookDoc.id];
    setBookedSlots(b=>({...b,[bookDoc.id]:[...(b[bookDoc.id]||[]),sl]}));
    setOk({doc:bookDoc.name,sl,date:form.date,name:form.name});
    setBookDoc(null); setForm({name:'',phone:'',date:''});
  };

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScreenHeader title="Find Doctors" sub="Book with top specialists"/>
      <View style={{padding:14,gap:8}}>
        <TextInput style={s.input} placeholder="Search name or specialty…" placeholderTextColor={T.textDim}
          value={search} onChangeText={setSearch}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8}}>
          {specs.map(sp=><Chip key={sp} label={sp} active={specF===sp} onPress={()=>setSpecF(sp)}/>)}
        </ScrollView>
      </View>
      <FlatList data={list} keyExtractor={d=>String(d.id)} contentContainerStyle={{paddingHorizontal:14,gap:12,paddingBottom:24}}
        showsVerticalScrollIndicator={false}
        renderItem={({item:doc})=>{
          const booked = bookedSlots[doc.id]||[];
          const sel = selSlots[doc.id];
          return(
            <Card>
              <View style={{flexDirection:'row',alignItems:'flex-start',marginBottom:8}}>
                <View style={{width:50,height:50,borderRadius:12,backgroundColor:'#1a2e4a',
                              alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Text style={{fontSize:24}}>{doc.emoji}</Text>
                </View>
                <View style={{flex:1,marginLeft:12}}>
                  <View style={{flexDirection:'row',alignItems:'center',gap:8,marginBottom:2}}>
                    <Text style={{fontSize:15,fontWeight:'800',color:T.text,flex:1}} numberOfLines={1}>{doc.name}</Text>
                    <Badge label={doc.avail?'Available':'Busy'} color={doc.avail?T.accentGreen:T.accentRed}/>
                  </View>
                  <Text style={{fontSize:12,color:T.textMuted}}>{doc.spec}</Text>
                  <View style={{flexDirection:'row',gap:12,marginTop:4}}>
                    <Text style={{fontSize:11,color:T.textMuted}}>⭐ {doc.rating}</Text>
                    <Text style={{fontSize:11,color:T.textMuted}}>🕐 {doc.exp}</Text>
                    <Text style={{fontSize:11,color:T.textMuted}}>💰 {doc.fee}</Text>
                  </View>
                </View>
              </View>
              <Text style={{fontSize:11,color:T.textMuted,marginBottom:10}}>📍 {doc.address}</Text>
              <View style={{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:12}}>
                {doc.slots.map(sl=>{
                  const isB=booked.includes(sl), isSel=sel===sl;
                  return(
                    <TouchableOpacity key={sl} disabled={isB}
                      onPress={()=>setSelSlots(p=>({...p,[doc.id]:sl}))}
                      style={{paddingHorizontal:11,paddingVertical:6,borderRadius:8,borderWidth:1,
                              borderColor:isSel?T.accent:T.border,
                              backgroundColor:isSel?T.accentGlow:T.surfaceLight,opacity:isB?0.35:1}}>
                      <Text style={{fontSize:11,color:isSel?T.accent:T.textMuted,
                        textDecorationLine:isB?'line-through':'none'}}>{sl}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {doc.avail&&(
                <GBtn colors={['#00C2FF','#0057FF']} label={sel?`Book ${sel}`:'Select a slot first'}
                  onPress={()=>{if(sel)setBookDoc(doc);else Alert.alert('Select Slot','Pick a time first.');}}/>
              )}
            </Card>
          );
        }}
      />
      <Modal visible={!!bookDoc} transparent animationType="slide" onRequestClose={()=>setBookDoc(null)}>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Confirm Appointment</Text>
            {bookDoc&&<View style={{backgroundColor:T.surfaceLight,borderRadius:10,padding:12,marginBottom:14,borderWidth:1,borderColor:T.border}}>
              <Text style={{fontWeight:'700',color:T.text}}>{bookDoc.name}</Text>
              <Text style={{color:T.textMuted,fontSize:13,marginTop:2}}>{bookDoc.spec} · {selSlots[bookDoc?.id]}</Text>
            </View>}
            <Text style={s.label}>PATIENT NAME</Text>
            <TextInput style={[s.input,{marginBottom:12}]} placeholder="Full name" placeholderTextColor={T.textDim} value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))}/>
            <Text style={s.label}>PHONE</Text>
            <TextInput style={[s.input,{marginBottom:12}]} placeholder="03XX-XXXXXXX" placeholderTextColor={T.textDim} keyboardType="phone-pad" value={form.phone} onChangeText={v=>setForm(f=>({...f,phone:v}))}/>
            <Text style={s.label}>DATE (e.g. 2025-04-10)</Text>
            <TextInput style={[s.input,{marginBottom:16}]} placeholder="YYYY-MM-DD" placeholderTextColor={T.textDim} value={form.date} onChangeText={v=>setForm(f=>({...f,date:v}))}/>
            <View style={{flexDirection:'row',gap:8}}>
              <GBtn colors={['#00C2FF','#0057FF']} label="Confirm Booking" onPress={doBook} style={{flex:1}}/>
              <TouchableOpacity onPress={()=>setBookDoc(null)} style={[s.outBtn,{flex:1}]}>
                <Text style={{color:T.accent,fontSize:13,fontWeight:'500'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={!!ok} transparent animationType="fade" onRequestClose={()=>setOk(null)}>
        <View style={s.overlay}>
          <View style={[s.sheet,{alignItems:'center'}]}>
            <Text style={{fontSize:52,marginBottom:12}}>🎉</Text>
            <Text style={s.sheetTitle}>Appointment Booked!</Text>
            {ok&&<><Text style={{color:T.textMuted,textAlign:'center',marginBottom:6}}>{ok.name} with {ok.doc}</Text>
            <Text style={{color:T.accentGreen,fontWeight:'700',marginBottom:20}}>{ok.date} at {ok.sl}</Text></>}
            <GBtn colors={['#00C2FF','#0057FF']} label="Done ✓" onPress={()=>setOk(null)} style={{width:'100%'}}/>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── PHARMACY ────────────────────────────────────────────────────
function PharmacyScreen() {
  const [search,setSearch] = useState('');
  const [cart,setCart] = useState([]);
  const [cartOpen,setCartOpen] = useState(false);
  const tog = id=>setCart(c=>c.includes(id)?c.filter(x=>x!==id):[...c,id]);
  const sc = v=>v>70?T.accentGreen:v>40?T.accentYellow:T.accentRed;
  const list = MEDICINES.filter(m=>!search||
    m.name.toLowerCase().includes(search.toLowerCase())||
    m.uses.toLowerCase().includes(search.toLowerCase()));

  return(
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScreenHeader title="Pharmacy" sub="Search medicines & availability"
        right={
          <TouchableOpacity onPress={()=>setCartOpen(true)}
            style={{width:42,height:42,borderRadius:21,backgroundColor:T.surfaceLight,
                    alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:T.border}}>
            <Text style={{fontSize:20}}>🛒</Text>
            {cart.length>0&&<View style={{position:'absolute',top:-2,right:-2,width:16,height:16,
              borderRadius:8,backgroundColor:T.accentRed,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'#fff',fontSize:9,fontWeight:'800'}}>{cart.length}</Text>
            </View>}
          </TouchableOpacity>
        }/>
      <View style={{padding:14}}>
        <TextInput style={s.input} placeholder="Search medicines or conditions…"
          placeholderTextColor={T.textDim} value={search} onChangeText={setSearch}/>
      </View>
      <FlatList data={list} keyExtractor={m=>String(m.id)} numColumns={2}
        contentContainerStyle={{paddingHorizontal:14,paddingBottom:24}}
        columnWrapperStyle={{gap:10,marginBottom:10}}
        showsVerticalScrollIndicator={false}
        renderItem={({item:med})=>{
          const inC=cart.includes(med.id), stc=sc(med.stock);
          return(
            <Card style={{flex:1}}>
              <Text style={{fontSize:14,fontWeight:'800',color:T.text,marginBottom:3}} numberOfLines={2}>{med.name}</Text>
              <Text style={{fontSize:10,color:T.textMuted,marginBottom:4}}>{med.type}</Text>
              <Text style={{fontSize:11,color:T.textMuted}}>📦 {med.unit}</Text>
              <Text style={{fontSize:11,color:T.textMuted,marginTop:2}} numberOfLines={2}>💊 {med.uses}</Text>
              <View style={{height:4,backgroundColor:T.surfaceLight,borderRadius:2,marginVertical:8}}>
                <View style={{height:4,borderRadius:2,backgroundColor:stc,width:`${med.stock}%`}}/>
              </View>
              <Text style={{fontSize:10,color:stc,marginBottom:8}}>Stock {med.stock}%</Text>
              <Text style={{fontSize:16,fontWeight:'900',color:T.accentGreen,marginBottom:8}}>{med.price}</Text>
              <TouchableOpacity onPress={()=>tog(med.id)}
                style={{paddingVertical:8,borderRadius:8,borderWidth:1,alignItems:'center',
                        borderColor:inC?T.accentGreen:T.border,backgroundColor:inC?T.accentGreen:'transparent'}}>
                <Text style={{fontSize:12,fontWeight:'600',color:inC?T.bg:T.accent}}>
                  {inC?'✓ Added':'+ Add'}
                </Text>
              </TouchableOpacity>
            </Card>
          );
        }}/>
      <Modal visible={cartOpen} transparent animationType="slide" onRequestClose={()=>setCartOpen(false)}>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>🛒 Your Cart</Text>
            {cart.length===0
              ?<Text style={{color:T.textMuted,textAlign:'center',paddingVertical:24}}>Cart is empty.</Text>
              :<>{cart.map(id=>{
                const m=MEDICINES.find(x=>x.id===id);
                return(<View key={id} style={{flexDirection:'row',alignItems:'center',paddingVertical:12,
                  borderBottomWidth:1,borderBottomColor:T.border}}>
                  <View style={{flex:1}}>
                    <Text style={{fontWeight:'600',color:T.text}}>{m.name}</Text>
                    <Text style={{fontSize:11,color:T.textMuted,marginTop:2}}>{m.unit}</Text>
                  </View>
                  <Text style={{color:T.accentGreen,fontWeight:'700',marginRight:12}}>{m.price}</Text>
                  <TouchableOpacity onPress={()=>tog(id)}>
                    <Text style={{color:T.accentRed,fontSize:18}}>✕</Text>
                  </TouchableOpacity>
                </View>);
              })}
              <GBtn colors={['#00C2FF','#0057FF']} style={{marginTop:16}}
                label="Place Order" onPress={()=>{setCart([]);setCartOpen(false);Alert.alert('Order Placed!','Your order is confirmed. (Demo)');}}/>
              </>
            }
            <TouchableOpacity onPress={()=>setCartOpen(false)} style={{marginTop:14,alignItems:'center'}}>
              <Text style={{color:T.textMuted}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── BLOOD BANK ──────────────────────────────────────────────────
function BloodScreen() {
  const [tab,setTab]=useState('find');
  const [selB,setSelB]=useState(null);
  const [form,setForm]=useState({name:'',blood:'A+',phone:''});
  const [done,setDone]=useState(false);
  const donors = selB?DONORS.filter(d=>d.blood===selB):DONORS;

  return(
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScreenHeader title="Blood Bank" sub="Find donors · Request blood"/>
      <View style={{flexDirection:'row',padding:14,gap:8}}>
        {[['find','🔍 Find'],['request','🚨 Request'],['donate','❤️ Donate']].map(([v,l])=>(
          <TouchableOpacity key={v} onPress={()=>{setTab(v);setDone(false);}}
            style={{flex:1,paddingVertical:9,borderRadius:10,alignItems:'center',borderWidth:1,
                    borderColor:tab===v?T.accent:T.border,backgroundColor:tab===v?T.accentGlow:'transparent'}}>
            <Text style={{fontSize:12,color:tab===v?T.accent:T.textMuted,fontWeight:tab===v?'700':'400'}}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={{padding:14,gap:12}} showsVerticalScrollIndicator={false}>
        {tab==='find'&&<>
          <Text style={s.secLabel}>TAP BLOOD TYPE TO FILTER</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:8}}>
            {BLOOD_TYPES.map(b=>(
              <TouchableOpacity key={b.type} onPress={()=>setSelB(t=>t===b.type?null:b.type)}
                style={{width:(SW-56)/4,borderRadius:10,borderWidth:1,
                        borderColor:selB===b.type?T.accentRed:T.border,
                        backgroundColor:selB===b.type?'#FF4D6A11':T.surfaceLight,
                        padding:10,alignItems:'center'}}>
                <Text style={{fontSize:20,fontWeight:'900',color:T.accentRed}}>{b.type}</Text>
                <Text style={{fontSize:9,color:T.textMuted,marginTop:2}}>{b.units} units</Text>
                <Text style={{fontSize:9,color:T.textMuted}}>{b.donors} donors</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={s.secLabel}>DONORS {selB?`• ${selB}`:''}</Text>
          {donors.map((d,i)=>(
            <Card key={i}>
              <View style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
                <LinearGradient colors={['#FF4D6A','#C0392B']}
                  style={{width:42,height:42,borderRadius:21,alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Text style={{color:'#fff',fontWeight:'800',fontSize:16}}>{d.name[0]}</Text>
                </LinearGradient>
                <View style={{flex:1,marginLeft:12}}>
                  <Text style={{fontWeight:'700',color:T.text}}>{d.name}</Text>
                  <Text style={{fontSize:11,color:T.textMuted,marginTop:2}}>📍 {d.city} · {d.last}</Text>
                </View>
                <Badge label={d.blood} color={T.accentRed}/>
              </View>
              <TouchableOpacity onPress={()=>Linking.openURL(`tel:${d.phone}`)} style={s.outBtn}>
                <Text style={{color:T.accent,fontSize:13,fontWeight:'500'}}>📞 Call {d.phone}</Text>
              </TouchableOpacity>
            </Card>
          ))}
        </>}
        {(tab==='request'||tab==='donate')&&(
          <Card>
            {done
              ?<View style={{alignItems:'center',paddingVertical:20}}>
                  <Text style={{fontSize:48,marginBottom:10}}>✅</Text>
                  <Text style={[s.sheetTitle,{textAlign:'center'}]}>{tab==='request'?'Request Submitted!':'Registered!'}</Text>
                  <Text style={{color:T.textMuted,textAlign:'center',marginBottom:20,lineHeight:20}}>
                    {tab==='request'?'We will contact matching donors shortly.':'Thank you! We will reach out when needed.'}
                  </Text>
                  <GBtn colors={['#FF4D6A','#C0392B']} label="Submit Another" onPress={()=>setDone(false)} style={{width:'100%'}}/>
                </View>
              :<>
                  <Text style={s.secLabel}>{tab==='request'?'BLOOD REQUEST':'DONOR REGISTRATION'}</Text>
                  <Text style={s.label}>FULL NAME</Text>
                  <TextInput style={[s.input,{marginBottom:12}]} placeholder="Your name" placeholderTextColor={T.textDim}
                    value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))}/>
                  <Text style={s.label}>BLOOD TYPE</Text>
                  <View style={{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:12}}>
                    {BLOOD_TYPES.map(b=>(
                      <TouchableOpacity key={b.type} onPress={()=>setForm(f=>({...f,blood:b.type}))}
                        style={{paddingHorizontal:12,paddingVertical:7,borderRadius:8,borderWidth:1,
                                borderColor:form.blood===b.type?T.accentRed:T.border,
                                backgroundColor:form.blood===b.type?'#FF4D6A11':T.surfaceLight}}>
                        <Text style={{fontSize:12,fontWeight:'600',color:form.blood===b.type?T.accentRed:T.textMuted}}>{b.type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={s.label}>PHONE</Text>
                  <TextInput style={[s.input,{marginBottom:16}]} placeholder="03XX-XXXXXXX" placeholderTextColor={T.textDim}
                    keyboardType="phone-pad" value={form.phone} onChangeText={v=>setForm(f=>({...f,phone:v}))}/>
                  <GBtn colors={['#FF4D6A','#C0392B']}
                    label={tab==='request'?'Submit Request':'Register as Donor'}
                    onPress={()=>{if(form.name&&form.phone)setDone(true);else Alert.alert('Missing Fields','Please fill in all fields.');}}/>
                </>
            }
          </Card>
        )}
        <View style={{height:20}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── NEARBY ──────────────────────────────────────────────────────
function NearbyScreen({ navigation }) {
  const [filter,setFilter]=useState('all');
  const [search,setSearch]=useState('');
  const [active,setActive]=useState(null);
  const tCol = t=>t==='doctor'?T.accent:t==='pharmacy'?T.accentGreen:T.accentRed;
  const tIcon = t=>t==='doctor'?'🩺':t==='pharmacy'?'💊':'🏥';
  const list = NEARBY.filter(p=>{
    if(filter!=='all'&&p.type!==filter)return false;
    if(search&&!p.name.toLowerCase().includes(search.toLowerCase())&&
       !p.spec.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });

  return(
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScreenHeader title="Nearby Healthcare" sub="Doctors · Pharmacies · Hospitals in Lahore"/>
      <View style={{padding:14,gap:8}}>
        <TextInput style={s.input} placeholder="Search places…" placeholderTextColor={T.textDim}
          value={search} onChangeText={setSearch}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8}}>
          {[['all','🗺️ All'],['doctor','👨‍⚕️ Doctors'],['pharmacy','💊 Pharmacies'],['hospital','🏥 Hospitals']].map(([v,l])=>(
            <Chip key={v} label={l} active={filter===v} onPress={()=>{setFilter(v);setActive(null);}}/>
          ))}
        </ScrollView>
      </View>
      <View style={{flexDirection:'row',paddingHorizontal:14,gap:8,marginBottom:10}}>
        {[['doctor',T.accent,'👨‍⚕️'],['pharmacy',T.accentGreen,'💊'],['hospital',T.accentRed,'🏥']].map(([type,color,icon])=>(
          <Card key={type} style={{flex:1,flexDirection:'row',alignItems:'center',gap:8,padding:10,marginBottom:0}}>
            <Text style={{fontSize:16}}>{icon}</Text>
            <View>
              <Text style={{fontWeight:'900',fontSize:18,color}}>{NEARBY.filter(p=>p.type===type).length}</Text>
              <Text style={{fontSize:9,color:T.textMuted}}>{type}s</Text>
            </View>
          </Card>
        ))}
      </View>
      <Text style={{fontSize:11,color:T.textMuted,paddingHorizontal:14,marginBottom:6}}>{list.length} places found</Text>
      <FlatList data={list} keyExtractor={p=>String(p.id)} contentContainerStyle={{paddingHorizontal:14,paddingBottom:24,gap:10}}
        showsVerticalScrollIndicator={false}
        renderItem={({item:p})=>{
          const isA=active===p.id, col=tCol(p.type);
          return(
            <Card onPress={()=>setActive(id=>id===p.id?null:p.id)} style={isA&&{borderColor:col}}>
              <View style={{flexDirection:'row',alignItems:'flex-start',gap:12}}>
                <View style={{width:46,height:46,borderRadius:12,backgroundColor:col+'18',
                              borderWidth:1,borderColor:col+'44',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Text style={{fontSize:20}}>{tIcon(p.type)}</Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={{fontWeight:'700',color:T.text,fontSize:14}}>{p.name}</Text>
                  <Text style={{fontSize:12,color:T.textMuted,marginTop:2}}>{p.spec}</Text>
                  <Text style={{fontSize:11,color:T.textMuted,marginTop:1}}>📍 {p.addr}, Lahore</Text>
                </View>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                <Text style={{color:T.accentGreen,fontWeight:'600',fontSize:12}}>📏 {p.dist}</Text>
                <Text style={{color:T.accentYellow,fontSize:12}}>⭐ {p.rating}</Text>
              </View>
              {isA&&<View style={{marginTop:12,gap:8}}>
                <View style={{flexDirection:'row',gap:8}}>
                  <GBtn colors={['#00C2FF','#0057FF']} label="🗺️ Directions" style={{flex:1}}
                    onPress={()=>Linking.openURL(`https://www.google.com/maps/dir/31.5204,74.3587/${p.lat},${p.lng}`)}/>
                  <TouchableOpacity style={[s.outBtn,{flex:1}]}
                    onPress={()=>Linking.openURL(`https://www.google.com/maps/search/${encodeURIComponent(p.name)}`)}>
                    <Text style={{color:T.accent,fontSize:12,fontWeight:'500'}}>📌 Google Maps</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={s.outBtn}
                  onPress={()=>navigation.navigate(p.type==='pharmacy'?'Pharmacy':'Doctors')}>
                  <Text style={{color:T.accent,fontSize:13,fontWeight:'500'}}>
                    {p.type==='pharmacy'?'💊 View Medicines':'📅 Book Appointment'}
                  </Text>
                </TouchableOpacity>
              </View>}
            </Card>
          );
        }}/>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:     {flex:1,backgroundColor:T.bg},
  card:       {backgroundColor:T.surface,borderRadius:14,borderWidth:1,borderColor:T.border,padding:14},
  input:      {backgroundColor:T.surfaceLight,borderRadius:10,borderWidth:1,borderColor:T.border,
               paddingHorizontal:14,paddingVertical:11,color:T.text,fontSize:14},
  gBtn:       {borderRadius:10,paddingVertical:12,paddingHorizontal:20,alignItems:'center',justifyContent:'center'},
  gBtnSm:     {paddingVertical:9,paddingHorizontal:14},
  gBtnTxt:    {color:'#fff',fontWeight:'700',fontSize:14},
  outBtn:     {borderRadius:10,paddingVertical:11,paddingHorizontal:16,borderWidth:1,
               borderColor:T.border,alignItems:'center',justifyContent:'center'},
  chip:       {paddingHorizontal:14,paddingVertical:7,borderRadius:20,borderWidth:1,borderColor:T.border},
  chipTxt:    {color:T.textMuted,fontSize:12},
  overlay:    {flex:1,backgroundColor:'#000c',justifyContent:'flex-end'},
  sheet:      {backgroundColor:T.surface,borderTopLeftRadius:22,borderTopRightRadius:22,
               padding:24,borderTopWidth:1,borderTopColor:T.border},
  sheetTitle: {fontSize:20,fontWeight:'800',color:T.text,marginBottom:14},
  secLabel:   {fontSize:11,fontWeight:'700',color:T.textMuted,textTransform:'uppercase',
               letterSpacing:1,marginBottom:10},
  label:      {fontSize:11,color:T.textMuted,fontWeight:'600',letterSpacing:0.5,
               textTransform:'uppercase',marginBottom:6},
});

// ─── NAVIGATION ──────────────────────────────────────────────────
const Tab = createBottomTabNavigator();
const TIcon = ({icon,label,focused}) => (
  <View style={{alignItems:'center',paddingTop:4}}>
    <Text style={{fontSize:20,opacity:focused?1:0.4}}>{icon}</Text>
    <Text style={{fontSize:9,marginTop:2,fontWeight:focused?'700':'400',color:focused?T.accent:T.textMuted}}>{label}</Text>
  </View>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={T.bg}/>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{headerShown:false,tabBarShowLabel:false,
          tabBarStyle:{backgroundColor:T.surface,borderTopColor:T.border,borderTopWidth:1,height:68,paddingBottom:10,paddingTop:4}}}>
          <Tab.Screen name="Home"     component={HomeScreen}     options={{tabBarIcon:({focused})=><TIcon icon="⊞"  label="Home"     focused={focused}/>}}/>
          <Tab.Screen name="Chat"     component={ChatScreen}     options={{tabBarIcon:({focused})=><TIcon icon="🤖" label="AI Chat"  focused={focused}/>}}/>
          <Tab.Screen name="Doctors"  component={DoctorsScreen}  options={{tabBarIcon:({focused})=><TIcon icon="👨‍⚕️" label="Doctors"  focused={focused}/>}}/>
          <Tab.Screen name="Pharmacy" component={PharmacyScreen} options={{tabBarIcon:({focused})=><TIcon icon="💊" label="Pharmacy" focused={focused}/>}}/>
          <Tab.Screen name="Blood"    component={BloodScreen}    options={{tabBarIcon:({focused})=><TIcon icon="🩸" label="Blood"    focused={focused}/>}}/>
          <Tab.Screen name="Nearby"   component={NearbyScreen}   options={{tabBarIcon:({focused})=><TIcon icon="📍" label="Nearby"   focused={focused}/>}}/>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}