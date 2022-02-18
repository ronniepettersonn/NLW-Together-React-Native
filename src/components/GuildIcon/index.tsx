
import { styles } from "./styles";

import { Image } from "react-native";

export function GuildIcon() {
    const uri = 'https://icon-library.com/images/discord-icon-png/discord-icon-png-28.jpg'

    return (
        <Image
            source={{ uri }}
            style={styles.image}
            resizeMode="cover"
        />
    )
}