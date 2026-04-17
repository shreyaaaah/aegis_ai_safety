import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../../constants/Config';

const MOCK_USER_ID = "user_777";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const resp = await fetch(`${CONFIG.BACKEND_URL}/contacts?user_id=${MOCK_USER_ID}`);
      const data = await resp.json();
      setContacts(data);
    } catch (e) {
      console.error(e);
    }
  };

  const addContact = async () => {
    if (!name || !phone) return;
    try {
      await fetch(`${CONFIG.BACKEND_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: MOCK_USER_ID,
          name,
          phone,
          relationship,
          is_primary: contacts.length === 0 ? 1 : 0
        })
      });
      setName('');
      setPhone('');
      setRelationship('');
      fetchContacts();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteContact = async (id: number) => {
    try {
      await fetch(`${BACKEND_URL}/contacts/${id}`, { method: 'DELETE' });
      fetchContacts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>TACTICAL NETWORK</Text>
      <Text style={styles.subtitle}>Emergency Response Contacts</Text>

      <View style={styles.addCard}>
        <TextInput 
          style={styles.input} 
          placeholder="Contact Name" 
          placeholderTextColor="#475569"
          value={name}
          onChangeText={setName}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Phone Number" 
          placeholderTextColor="#475569"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Relationship (e.g. Guardian)" 
          placeholderTextColor="#475569"
          value={relationship}
          onChangeText={setRelationship}
        />
        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Text style={styles.addButtonText}>ENROLL CONTACT</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {contacts.map((c) => (
          <View key={c.id} style={[styles.contactCard, c.is_primary === 1 && styles.primaryCard]}>
            <View style={styles.contactInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.contactName}>{c.name}</Text>
                {c.is_primary === 1 && (
                   <View style={styles.primaryBadge}>
                     <Text style={styles.primaryText}>PRIMARY</Text>
                   </View>
                )}
              </View>
              <Text style={styles.contactSub}>{c.relationship} • {c.phone}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteContact(c.id)}>
              <Ionicons name="trash-outline" size={20} color="#FF0055" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  addCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 15,
    color: '#FFF',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  addButton: {
    backgroundColor: '#00E5FF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#0B0F19',
    fontWeight: '900',
    letterSpacing: 1.5,
    fontSize: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  primaryCard: {
    borderColor: 'rgba(0, 229, 255, 0.3)',
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
  },
  primaryBadge: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#00E5FF',
  },
  primaryText: {
    color: '#00E5FF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  }
});
