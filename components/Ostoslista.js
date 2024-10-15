import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../firebase/Config';
import { collection, addDoc, deleteDoc, onSnapshot, doc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const Ostoslista = () => {
    const [item, setItem] = useState('');
    const [items, setItems] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'ostoslista'), (snapshot) => {
            const itemList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItems(itemList);
        });
        return () => unsubscribe();
    }, []);

    const addItem = async () => {
        if (item.trim()) {
            await addDoc(collection(db, 'ostoslista'), { name: item });
            setItem('');
        }
    };

    const removeItem = async (id) => {
        await deleteDoc(doc(db, 'ostoslista', id));
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24 }}>Ostoslista</Text>
            <TextInput
                placeholder="Kirjoita tuote"
                value={item}
                onChangeText={setItem}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    padding: 10,
                    marginVertical: 10
                }}
            />
            <Button title="Lisää tuote" onPress={addItem} />
            <FlatList
                data={items}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                        <Text>{item.name}</Text>
                        <TouchableOpacity onPress={() => removeItem(item.id)}>
                            <Icon name="trash" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

export default Ostoslista;
