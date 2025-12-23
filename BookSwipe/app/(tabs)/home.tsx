import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type BookCard = {
  id: string;
  title: string;
  author: string;
  genre: string;
  blurb: string;
  image: string;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DISTANCE = SCREEN_WIDTH * 1.2;

const sampleBooks: BookCard[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    blurb: 'A second chance at every life you never lived.',
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Sci-Fi',
    blurb: 'One astronaut. One alien. One shot to save humanity.',
    image:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Nonfiction',
    blurb: 'Small habits, remarkable results. Swipe right for better routines.',
    image:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'The House in the Cerulean Sea',
    author: 'T.J. Klune',
    genre: 'Fantasy',
    blurb: 'A charming tale about found family and unexpected magic.',
    image:
      'https://images.unsplash.com/photo-1471109880861-75cec67f8b68?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    title: 'Crying in H Mart',
    author: 'Michelle Zauner',
    genre: 'Memoir',
    blurb: 'Food, family, and grief in a heartfelt coming-of-age memoir.',
    image:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
  },
];

export default function HomeScreen() {
  const [cards, setCards] = useState<BookCard[]>(sampleBooks);
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
          position.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx > SWIPE_THRESHOLD) {
            forceSwipe('right');
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            forceSwipe('left');
          } else {
            resetCard();
          }
        },
      }),
    [position],
  );

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SWIPE_OUT_DISTANCE : -SWIPE_OUT_DISTANCE;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 200,
      useNativeDriver: true,
    }).start(() => onSwipeComplete());
  };

  const onSwipeComplete = () => {
    setCards(prev => prev.slice(1));
    position.setValue({ x: 0, y: 0 });
  };

  const resetCard = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const renderCards = () => {
    if (cards.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>You’re all caught up 🎉</Text>
          <Text style={styles.emptySubtitle}>Check back soon for more books to swipe.</Text>
        </View>
      );
    }

    return cards
      .map((card, index) => {
        if (index === 0) {
          const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
            outputRange: ['-12deg', '0deg', '12deg'],
          });

          const likeOpacity = position.x.interpolate({
            inputRange: [0, SWIPE_THRESHOLD],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          });

          const nopeOpacity = position.x.interpolate({
            inputRange: [-SWIPE_THRESHOLD, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={card.id}
              style={[
                styles.card,
                {
                  transform: [...position.getTranslateTransform(), { rotate }],
                },
              ]}
              {...panResponder.panHandlers}>
              <View style={styles.image} />
              <Animated.View style={[styles.badge, styles.badgeLike, { opacity: likeOpacity }]}>
                <Text style={styles.badgeText}>Like</Text>
              </Animated.View>
              <Animated.View style={[styles.badge, styles.badgeNope, { opacity: nopeOpacity }]}>
                <Text style={styles.badgeText}>Pass</Text>
              </Animated.View>
              <View style={styles.cardContent}>
                <Text style={styles.genre}>{card.genre.toUpperCase()}</Text>
                <Text style={styles.title}>{card.title}</Text>
                <Text style={styles.author}>by {card.author}</Text>
                <Text style={styles.blurb}>{card.blurb}</Text>
              </View>
            </Animated.View>
          );
        }

        return (
          <Animated.View
            key={card.id}
            style={[
              styles.card,
              styles.stackedCard,
              { top: 16 * Math.min(index, 2), transform: [{ scale: 1 - index * 0.04 }] },
            ]}>
            <View style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.genre}>{card.genre.toUpperCase()}</Text>
              <Text style={styles.title}>{card.title}</Text>
              <Text style={styles.author}>by {card.author}</Text>
            </View>
          </Animated.View>
        );
      })
      .reverse();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BookSwipe</Text>
        <Text style={styles.headerSubtitle}>Swipe through books like Tinder.</Text>
      </View>
      <View style={styles.deck}>{renderCards()}</View>
      <View style={styles.actions}>
        <Pressable style={[styles.actionButton, styles.passButton]} onPress={() => forceSwipe('left')}>
          <Text style={styles.actionText}>Pass</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => forceSwipe('right')}>
          <Text style={styles.actionText}>Like</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#94A3B8',
    marginTop: 6,
    fontSize: 15,
  },
  deck: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '78%',
    borderRadius: 18,
    backgroundColor: '#0B1224',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  stackedCard: {
    opacity: 0.7,
  },
  image: {
    height: '58%',
    backgroundColor: '#1F2937',
  },
  cardContent: {
    padding: 16,
    gap: 6,
  },
  genre: {
    color: '#38BDF8',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
  },
  author: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  blurb: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  badge: {
    position: 'absolute',
    top: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  badgeLike: {
    right: 16,
    backgroundColor: 'rgba(74,222,128,0.9)',
  },
  badgeNope: {
    left: 16,
    backgroundColor: 'rgba(248,113,113,0.9)',
  },
  badgeText: {
    color: '#0B1224',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passButton: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  likeButton: {
    backgroundColor: '#22D3EE',
  },
  actionText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0B1224',
    borderRadius: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#94A3B8',
    textAlign: 'center',
  },
});

