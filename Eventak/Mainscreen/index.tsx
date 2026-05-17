import React, { useRef, useState } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, 
  TouchableOpacity, SafeAreaView, Dimensions, Animated, Platform, ImageBackground, StatusBar
} from 'react-native';


import BotMenu from '../Components/BotMenu';
import SideBar from '../Components/SideBar';

const { width } = Dimensions.get('window');
const backgroundImage = require('../Assets/Saudi.png'); 

const featuredEvents = [
  { id: '1', image: require('../Assets/leap.png'), title: 'LEAP 2026', details: 'The Tech Event of the Future' },
  { id: '2', image: require('../Assets/blackhat.png'), title: 'Blackhat 2026', details: 'Secure the Cyber World' },
];

const BotIcon = () => (
  <View style={styles.botIconWrapper}>
    <View style={styles.botHead}>
      <View style={styles.botEyesRow}>
        <View style={styles.botEye} />
        <View style={styles.botEye} />
      </View>
    </View>
    <View style={styles.botAntenna} />
  </View>
);

const FeaturedCard = ({ item }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 1.05, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.featuredCardContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity activeOpacity={1} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.featuredTouch}>
        <Image source={item.image} style={styles.featuredImage} />
        <View style={styles.featuredTextOverlay}>
          <Text style={styles.featuredTitle}>{item.title}</Text>
          <Text style={styles.featuredDetails}>{item.details}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CategoryCard = ({ title, img, onPress }: any) => {
  const scaleXAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => Animated.timing(scaleXAnim, { toValue: 1.08, duration: 150, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.timing(scaleXAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.card, { transform: [{ scaleX: scaleXAnim }] }]}>
      <TouchableOpacity activeOpacity={1} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} style={styles.cardTouch}>
        <Image source={img} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardText}>{title}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const MainScreen = ({ navigation }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  
  const [isBotVisible, setBotVisible] = useState(false);
  const [isSideBarVisible, setSideBarVisible] = useState(false);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width - 20));
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.bgImage} resizeMode="cover" blurRadius={4}>
        
        {/* Header */}
        <View style={styles.header}>
          
          <TouchableOpacity 
            style={styles.headerCircleBtn}
            onPress={() => setBotVisible(true)} 
          >
            <BotIcon /> 
          </TouchableOpacity>

          <Text style={styles.headerTitle}>EVENTAK</Text>

          
          <TouchableOpacity 
            style={styles.headerCircleBtn}
            onPress={() => setSideBarVisible(true)}
          >
             <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitleFeatured}>Featured Exclusive</Text>
          <View>
            <ScrollView 
              horizontal pagingEnabled showsHorizontalScrollIndicator={false}
              onScroll={handleScroll} scrollEventThrottle={16}
              style={styles.featuredCarousel} snapToInterval={width - 20} decelerationRate="fast"
            >
              {featuredEvents.map((event) => (<FeaturedCard key={event.id} item={event} />))}
            </ScrollView>

            <View style={styles.paginationDots}>
              {featuredEvents.map((_, i) => (
                <View key={i} style={[styles.dot, activeIndex === i ? styles.activeDot : styles.inactiveDot]} />
              ))}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesGrid}>
              <CategoryCard 
                title="Technology" 
                img={require('../Assets/tech.png')} 
                onPress={() => navigation.navigate('Explore', { categoryName: 'Technology' })}
              />
              <CategoryCard 
                title="Riyadh Season" 
                img={require('../Assets/riyadh.png')} 
                onPress={() => navigation.navigate('Explore', { categoryName: 'Riyadh Season' })}
              />
              <CategoryCard 
                title="Gaming" 
                img={require('../Assets/gamer.png')} 
                onPress={() => navigation.navigate('Explore', { categoryName: 'Gaming' })}
              />
              <CategoryCard 
                title="Saudi Culture" 
                img={require('../Assets/saudia.png')} 
                onPress={() => navigation.navigate('Explore', { categoryName: 'Saudi Culture' })}
              /> 
            </View>
          </View>
        </ScrollView>

        
        <BotMenu 
          visible={isBotVisible} 
          onClose={() => setBotVisible(false)} 
          navigation={navigation} 
        />
        <SideBar 
        visible={isSideBarVisible} 
        onClose={() => setSideBarVisible(false)} 
        navigation={navigation} 
        />

      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0831' },
  bgImage: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, paddingTop: 40 },
  headerCircleBtn: { 
    width: 45, height: 45, borderRadius: 22.5, 
    backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  menuIcon: { color: '#FFF', fontSize: 22 },
  headerTitle: { color: '#B0A0D0', fontSize: 24, fontWeight: 'bold', letterSpacing: 2, fontFamily: Platform.OS === 'ios' ? 'Palatino' : 'serif' },
  botIconWrapper: { alignItems: 'center', justifyContent: 'center' },
  botHead: { width: 18, height: 14, backgroundColor: '#B0A0D0', borderRadius: 4, padding: 3 },
  botEyesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  botEye: { width: 3, height: 3, backgroundColor: '#1A0831', borderRadius: 1.5 },
  botAntenna: { width: 2, height: 4, backgroundColor: '#B0A0D0', position: 'absolute', top: -4 },
  sectionTitleFeatured: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 'bold', letterSpacing: 1, marginTop: 10, marginLeft: 25 },
  featuredCarousel: { height: 230, marginTop: 10 },
  featuredCardContainer: { width: width - 40, height: 210, marginHorizontal: 20, borderRadius: 20, overflow: 'hidden' },
  featuredTouch: { flex: 1, justifyContent: 'flex-end' },
  featuredImage: { width: '100%', height: '100%', position: 'absolute' },
  featuredTextOverlay: { padding: 20, backgroundColor: 'rgba(0,0,0,0.5)' },
  featuredTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  featuredDetails: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  paginationDots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { width: 20, backgroundColor: '#B0A0D0' },
  inactiveDot: { width: 8, backgroundColor: 'rgba(255,255,255,0.3)' },
  sectionContainer: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', marginBottom: 20 },
  cardTouch: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 15, padding: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardImage: { width: '100%', height: 130, borderRadius: 12 },
  cardTextContainer: { padding: 10 },
  cardText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
});

export default MainScreen;