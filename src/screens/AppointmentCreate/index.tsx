import { styles } from './styles'
import { Text, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { Background } from '../../components/Background'

import { Feather } from '@expo/vector-icons'

import { Header } from '../../components/Header'
import { theme } from '../../global/styles/theme'
import { CategorySelect } from '../../components/CategorySelect'
import { useState } from 'react'
import { RectButton } from 'react-native-gesture-handler'
import { GuildIcon } from '../../components/GuildIcon'
import { SmallInput } from '../../components/SmallInput'
import { TextArea } from '../../components/TextArea'
import { Button } from '../../components/Button'
import { ModalView } from '../../components/ModalView'
import { Guilds } from '../Guilds'
import { GuildProps } from '../../components/Guild'

import uuid from 'react-native-uuid'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLLECTION_APPOINTMENT } from '../../configs/database'
import { useNavigation } from '@react-navigation/native'

export function AppointmentCreate() {
    const [category, setCategory] = useState('')
    const [openGuildModal, setOpenGuildModal] = useState(false)
    const [guild, setGuild] = useState<GuildProps>({} as GuildProps)

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [description, setDescription] = useState('');

    const navigation = useNavigation();

    function handleOpenGuilds() {
        setOpenGuildModal(true)
    }

    function handleGuildSelect(guildSelect: GuildProps) {
        setGuild(guildSelect)
        setOpenGuildModal(false)
    }

    function handleCloseGuilds() {
        setOpenGuildModal(false)
    }

    function hendleCategorySelect(categoryId: string) {
        setCategory(categoryId);
    }

    async function handleSave() {

        if (category === '') {
            Alert.alert('Escolha uma categoria')
        } else {
            const newAppointment = {
                id: uuid.v4(),
                guild,
                category,
                date: `${day}/${month} às ${hour}:${minute}h`,
                description
            }

            const storage = await AsyncStorage.getItem(COLLECTION_APPOINTMENT);
            const appointments = storage ? JSON.parse(storage) : [];

            await AsyncStorage.setItem(
                COLLECTION_APPOINTMENT,
                JSON.stringify([...appointments, newAppointment])
            );

            navigation.navigate('Home')
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            style={styles.container}
        >
            <ScrollView>
                <Background>
                    <Header
                        title='Agendar partida'
                    />

                    <Text style={[styles.label, { marginLeft: 24, marginTop: 16, marginBottom: 18 }]}>
                        Categorias
                    </Text>

                    <CategorySelect
                        hasCheckBox
                        setCategory={hendleCategorySelect}
                        categorySelected={category}
                    />

                    <View style={styles.form}>
                        <RectButton onPress={handleOpenGuilds}>
                            <View style={styles.select}>

                                {
                                    guild.icon ? <GuildIcon guildId={guild.id} iconId={guild.icon} /> : <View style={styles.image} />

                                }

                                <View style={styles.selectBody} >
                                    <Text style={styles.label}>
                                        {guild.name ? guild.name : 'Selecione um servidor'}
                                    </Text>
                                </View>

                                <Feather
                                    name='chevron-right'
                                    color={theme.colors.heading}
                                    size={18}
                                />

                            </View>
                        </RectButton>


                        <View style={styles.field}>
                            <View>
                                <Text style={[styles.label, { marginBottom: 12 }]}>
                                    Dia e mês
                                </Text>

                                <View style={styles.column}>
                                    <SmallInput
                                        maxLength={2}
                                        onChangeText={setDay}
                                    />
                                    <Text style={styles.divider}>
                                        /
                                    </Text>
                                    <SmallInput
                                        maxLength={2}
                                        onChangeText={setMonth}
                                    />

                                </View>
                            </View>

                            <View>
                                <Text style={[styles.label, { marginBottom: 12 }]}>
                                    Hora e minuto
                                </Text>

                                <View style={styles.column}>
                                    <SmallInput
                                        maxLength={2}
                                        onChangeText={setHour}
                                    />
                                    <Text style={styles.divider}>
                                        :
                                    </Text>
                                    <SmallInput
                                        maxLength={2}
                                        onChangeText={setMinute}
                                    />

                                </View>
                            </View>

                        </View>

                        <View style={[styles.field, { marginBottom: 12 }]}>
                            <Text style={styles.label}>
                                Descrição
                            </Text>

                            <Text style={styles.caracteresLimit}>
                                Max 100 caracteres
                            </Text>
                        </View>


                        <TextArea
                            multiline
                            maxLength={100}
                            numberOfLines={5}
                            autoCorrect={false}
                            onChangeText={setDescription}
                        />

                        <View style={styles.footer}>
                            <Button
                                title='Agendar'
                                onPress={handleSave}
                            />
                        </View>

                    </View>
                </Background>
            </ScrollView>

            <ModalView visible={openGuildModal} closeModal={handleCloseGuilds}>
                <Guilds handleGuildSelect={handleGuildSelect} />
            </ModalView>
        </KeyboardAvoidingView>
    )
}