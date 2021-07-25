import { useState, useCallback } from 'react';
import { checkCollision, STAGE_WIDTH } from '../gameHelpers';
import { TETROMINOS, randomTetromino } from '../tetrominos';

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        pos: { x: 0, y: 0},
        tetromino: TETROMINOS[0].shape,
        collided: false
    });

    const rotate = (matrix, dir) => {
        const rotatedTetro = matrix.map((_, index) =>
            matrix.map(col => col[index])
        );
        if (dir > 0) return rotatedTetro.map(row => row.reverse())
        return rotatedTetro.reverse()
    }

    const playerRotate = (stage, dir) => {
        const copyPlayer = JSON.parse(JSON.stringify(player))
        copyPlayer.tetromino = rotate(copyPlayer.tetromino, dir)

        // Fix rotations near boundary
        const pos = copyPlayer.pos.x
        let offset = 1
        while(checkCollision(copyPlayer, stage, { x: 0, y: 0})) {
            copyPlayer.pos.x += offset
            offset = -(offset + (offset > 0 ? 1 : -1))
            if (offset > copyPlayer.tetromino[0].length) {
                rotate(copyPlayer.tetromino, -dir)
                copyPlayer.pos.x = pos
                return
            }
        }

        setPlayer(copyPlayer)
    }

    const updatePlayerPos = ({ x, y, collided}) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
            collided,
        }))
    }

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: STAGE_WIDTH/2 - 2, y: 0 },
            tetromino: randomTetromino().shape,
            collided: false
        })
    }, [])

    return [player, updatePlayerPos, resetPlayer, playerRotate];
}