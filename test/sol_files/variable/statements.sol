pragma solidity ^0.4.24;

contract TestStorage {
	uint t =23;
	uint[]  abc;

   struct Game {
        address player;
        uint256 number;
    }


	function lol(uint8 r){
		Game gamePlayed;
		Game[] gamesPlayed;
		(uint x, uint m) = (1 ,2);
		uint[20] storage i;
		uint y = 1 + x + rofl();
		if (1==1){
			y = 1337;
			if(1==2){ y = 1338; }
		}
	}
	function rofl() returns (uint){
		return 2;
	} 
}
