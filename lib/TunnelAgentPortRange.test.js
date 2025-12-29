
import assert from 'assert';
import TunnelAgent from './TunnelAgent';

describe('TunnelAgent Port Range', () => {
    it('should assign a port within the specified range', async () => {
        const minPort = 30000;
        const maxPort = 30010;
        const agent = new TunnelAgent({
            minPort,
            maxPort,
        });

        const info = await agent.listen();
        assert.ok(info.port >= minPort);
        assert.ok(info.port <= maxPort);
        agent.destroy();
    });

    it('should assign different ports for multiple agents in same range', async () => {
        const minPort = 30020;
        const maxPort = 30050; // Larger range to avoid collisions
        const agent1 = new TunnelAgent({ minPort, maxPort });
        const agent2 = new TunnelAgent({ minPort, maxPort });

        const info1 = await agent1.listen();
        const info2 = await agent2.listen();

        assert.ok(info1.port >= minPort && info1.port <= maxPort);
        assert.ok(info2.port >= minPort && info2.port <= maxPort);
        assert.notEqual(info1.port, info2.port);

        agent1.destroy();
        agent2.destroy();
    });

    // Note: Testing EADDRINUSE handling specifically is hard without mocking net.listen or filling up all ports
    // We can rely on 'should assign different ports' to implicitly test that it found a free port.
});
